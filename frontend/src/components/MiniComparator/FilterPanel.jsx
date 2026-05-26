import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilterValue,
  setFilterEnabled,
  setSortBy,
  resetFilters,
} from '../../store/slices/filtersSlice';
import {
  makeSelectOptionsFor,
  makeSelectRangeBoundsFor,
  makeSelectContextualCountsFor,
} from '../../store/selectors/wheelsSelectors';
import {
  COLUMN_GROUPS,
  getFilterableProperties,
  getAllSorts,
} from '../../config/wheelProperties';
import { roundToStep, clampLow, clampHigh } from './rangeMath';
import styles from './FilterPanel.module.css';

// ---------------------------------------------------------------------------
// Reusable UI primitives (unchanged from original prototype).
// ---------------------------------------------------------------------------

// Toggle switch positioned to the left of a filter label. When off, the parent
// block fades out its controls and the selector ignores this filter.
const FilterToggle = ({ enabled, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={ariaLabel}
    onClick={() => onChange(!enabled)}
    className={`flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brass-8 focus:ring-offset-1 ${
      enabled ? 'bg-brass-7 justify-end' : 'bg-ink-4 justify-start'
    }`}
  >
    <span className="h-4 w-4 rounded-full bg-paper-0 transition-transform" />
  </button>
);

const DualRangeRow = ({
  label,
  unit,
  min,
  max,
  step: stepProp,
  valueLow,
  valueHigh,
  onChangeLow,
  onChangeHigh,
  enabled = true,
  onToggleEnabled,
}) => {
  const computedStep = (max - min) / 50 > 1 ? 1 : 0.1;
  const effectiveStep = stepProp ?? computedStep;
  const minDiff = roundToStep(
    Math.max((max - min) / 20, effectiveStep),
    effectiveStep
  );

  const pct = (v) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  const handleLow = (raw) =>
    onChangeLow(clampLow({ raw, min, valueHigh, step: effectiveStep, minDiff }));

  const handleHigh = (raw) =>
    onChangeHigh(
      clampHigh({ raw, max, valueLow, step: effectiveStep, minDiff })
    );

  const lowZ = valueLow >= max - minDiff ? 5 : 3;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between text-sm">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink-7">
          {onToggleEnabled && (
            <FilterToggle
              enabled={enabled}
              onChange={onToggleEnabled}
              ariaLabel={`Enable ${label.toLowerCase()} filter`}
            />
          )}
          {label}
        </span>
        <span className="text-ink-7 tabular-nums font-mono">
          {valueLow}
          {unit} — {valueHigh}
          {unit}
        </span>
      </div>
      <div className={`space-y-3 ${enabled ? '' : 'opacity-50'}`}>
        <div className="flex items-center">
          <input
            type="number"
            value={valueLow}
            min={min}
            max={max}
            step={effectiveStep}
            disabled={!enabled}
            onChange={(e) => handleLow(e.target.value)}
            className="w-24 rounded-xs border border-ink-4 px-2 py-1.5 text-sm text-center focus:border-brass-8 focus:outline-none disabled:cursor-not-allowed"
          />
          <span className="flex-1 text-center text-ink-5 text-xs select-none">
            —
          </span>
          <input
            type="number"
            value={valueHigh}
            min={min}
            max={max}
            step={effectiveStep}
            disabled={!enabled}
            onChange={(e) => handleHigh(e.target.value)}
            className="w-24 rounded-xs border border-ink-4 px-2 py-1.5 text-sm text-center focus:border-brass-8 focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
        <div className="relative h-5 flex items-center">
          <div className={styles.track} />
          <div
            className={styles.range}
            style={{
              left: `${pct(valueLow)}%`,
              width: `${pct(valueHigh) - pct(valueLow)}%`,
            }}
          />
          <input
            type="range"
            className={styles.thumb}
            min={min}
            max={max}
            step={effectiveStep}
            value={valueLow}
            disabled={!enabled}
            onChange={(e) => handleLow(e.target.value)}
            style={{ zIndex: lowZ }}
          />
          <input
            type="range"
            className={styles.thumb}
            min={min}
            max={max}
            step={effectiveStep}
            value={valueHigh}
            disabled={!enabled}
            onChange={(e) => handleHigh(e.target.value)}
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
    </div>
  );
};

// Accordion for grouping filters by category.
const Section = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-ink-3 pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-ink-7">{title}</span>
        <svg
          className={`h-4 w-4 text-ink-6 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && <div className="mt-4 space-y-5">{children}</div>}
    </div>
  );
};

// Pill button for multiple selections (multiSelect, triState).
const Pill = ({ active, muted, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
      ${active
        ? 'bg-brass-7 text-ink-12 border-brass-7'
        : 'bg-paper-0 text-ink-11 border-ink-4 hover:border-brass-8 hover:text-brass-8'
      }
      ${muted ? 'opacity-40' : ''}`}
  >
    {children}
  </button>
);

// ---------------------------------------------------------------------------
// Typed adapters. Each adapter handles a filter type declared in the registry.
// To add a new type, create an adapter and register it in the FILTER_ADAPTERS
// map, then add the corresponding matcher in store/selectors/wheelsSelectors.js.
// ---------------------------------------------------------------------------

const RangeFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const { step } = property.filter;
  const selectBounds = useMemo(() => makeSelectRangeBoundsFor(property.id), [property.id]);
  const bounds = useSelector(selectBounds);
  const value = filter.value; // { min, max }
  return (
    <DualRangeRow
      label={property.label}
      unit={property.unit ?? ''}
      min={bounds.min}
      max={bounds.max}
      step={step}
      valueLow={value.min}
      valueHigh={value.max}
      onChangeLow={(v) =>
        dispatch(
          setFilterValue({ id: property.id, value: { min: v, max: value.max } })
        )
      }
      onChangeHigh={(v) =>
        dispatch(
          setFilterValue({ id: property.id, value: { min: value.min, max: v } })
        )
      }
      enabled={filter.enabled}
      onToggleEnabled={(v) =>
        dispatch(setFilterEnabled({ id: property.id, enabled: v }))
      }
    />
  );
};

const LargeMultiSelectFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const selectOptions = useMemo(() => makeSelectOptionsFor(property.id), [property.id]);
  const options = useSelector(selectOptions);
  const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
  const counts = useSelector(selectCounts);

  const toggle = (option) => {
    const next = filter.value.includes(option)
      ? filter.value.filter((v) => v !== option)
      : [...filter.value, option];
    dispatch(setFilterValue({ id: property.id, value: next }));
  };

  const visible = search
    ? options.filter((o) =>
        String(o).toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={`Enable ${property.label.toLowerCase()} filter`}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-ink-7">{property.label}</span>
      </div>
      <div className={filter.enabled ? '' : 'opacity-50 pointer-events-none'}>
        {filter.value.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {filter.value.map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => toggle(v)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brass-7 text-ink-12 hover:bg-brass-8 transition-colors"
              >
                {String(v)}
                <span aria-hidden="true" className="text-ink-12/60">×</span>
              </button>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xs border border-ink-4 px-3 py-1.5 text-sm focus:border-brass-8 focus:outline-none mb-2"
        />
        <ul className="max-h-40 overflow-y-auto rounded-lg border border-ink-3">
          {visible.map((opt) => {
            const count = counts[String(opt)] ?? 0;
            const isActive = filter.value.includes(opt);
            const isMuted = count === 0 && !isActive;
            return (
              <li key={String(opt)}>
                <label className={`flex items-center gap-2 px-3 py-1.5 hover:bg-ink-2/60 cursor-pointer text-sm ${isMuted ? 'text-ink-4' : 'text-ink-11'}`}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggle(opt)}
                    className="h-4 w-4 rounded border-ink-4 accent-brass-7 focus:ring-brass-8"
                  />
                  {String(opt)} ({count})
                </label>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-3 py-2 text-sm text-ink-500 italic">No results</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const MultiSelectFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const selectOptions = useMemo(() => makeSelectOptionsFor(property.id), [property.id]);
  const options = useSelector(selectOptions);
  const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
  const counts = useSelector(selectCounts);

  if (options.length <= 1) return null;
  if (options.length > 10) return <LargeMultiSelectFilter property={property} filter={filter} />;

  const toggle = (option) => {
    const next = filter.value.includes(option)
      ? filter.value.filter((v) => v !== option)
      : [...filter.value, option];
    dispatch(setFilterValue({ id: property.id, value: next }));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={`Enable ${property.label.toLowerCase()} filter`}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-ink-7">{property.label}</span>
      </div>
      <div
        className={`flex flex-wrap gap-1.5 ${
          filter.enabled ? '' : 'opacity-50 pointer-events-none'
        }`}
      >
        {options.map((opt) => {
          const count = counts[String(opt)] ?? 0;
          const isActive = filter.value.includes(opt);
          return (
            <Pill
              key={String(opt)}
              active={isActive}
              muted={count === 0 && !isActive}
              onClick={() => toggle(opt)}
            >
              {String(opt)} ({count})
            </Pill>
          );
        })}
      </div>
    </div>
  );
};

const TriStateFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const [labelAll, labelTrue, labelFalse] = property.filter.labels;
  const set = (v) => dispatch(setFilterValue({ id: property.id, value: v }));

  const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
  const counts = useSelector(selectCounts);
  const trueCount = counts['true'] ?? 0;
  const falseCount = counts['false'] ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={`Enable ${property.label.toLowerCase()} filter`}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-ink-7">{property.label}</span>
      </div>
      <div className={`flex flex-wrap gap-1.5 ${filter.enabled ? '' : 'opacity-50 pointer-events-none'}`}>
        <Pill active={filter.value === null} onClick={() => set(null)}>
          {labelAll}
        </Pill>
        <Pill
          active={filter.value === true}
          muted={trueCount === 0 && filter.value !== true}
          onClick={() => set(true)}
        >
          {labelTrue} ({trueCount})
        </Pill>
        <Pill
          active={filter.value === false}
          muted={falseCount === 0 && filter.value !== false}
          onClick={() => set(false)}
        >
          {labelFalse} ({falseCount})
        </Pill>
      </div>
    </div>
  );
};

// Type → component map. Extend this map to add a new filter type.
const FILTER_ADAPTERS = {
  range: RangeFilter,
  multiSelect: MultiSelectFilter,
  triState: TriStateFilter,
};

// Dispatcher: routes to the correct adapter based on property.filter.type.
const FilterField = ({ property }) => {
  const filter = useSelector((s) => s.filters.filters[property.id]);
  const Adapter = FILTER_ADAPTERS[property.filter.type];
  if (!Adapter || !filter) return null;
  return <Adapter property={property} filter={filter} />;
};

// ---------------------------------------------------------------------------
// Main panel — iterates over groups and filterable properties.
// ---------------------------------------------------------------------------

const FilterPanel = () => {
  const dispatch = useDispatch();
  const sortBy = useSelector((s) => s.filters.sortBy);
  const sorts = useMemo(() => getAllSorts(), []);
  const filterables = useMemo(() => getFilterableProperties(), []);

  return (
    <aside className="card p-5 lg:p-6 space-y-6 h-fit lg:sticky lg:top-20">
      {/* Header with reset shortcut */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-11">Filters</h3>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-medium text-brass-8 hover:text-brass-9"
        >
          Reset
        </button>
      </div>

      {/* Sort — options generated from registry */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-11">Sort by</label>
        <select
          value={sortBy ?? ''}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm focus:border-brass-8 focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters grouped by category — first group (general) open by default */}
      {COLUMN_GROUPS.map((group, idx) => {
        const props = filterables.filter((p) => p.group === group.id);
        if (props.length === 0) return null;
        return (
          <Section key={group.id} title={group.label} defaultOpen={idx === 0}>
            {props.map((p) => (
              <FilterField key={p.id} property={p} />
            ))}
          </Section>
        );
      })}
    </aside>
  );
};

export default FilterPanel;
