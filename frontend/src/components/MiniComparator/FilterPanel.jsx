import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilterValue,
  setFilterEnabled,
  setSortBy,
  resetFilters,
} from '../../store/slices/filtersSlice';
import { makeSelectOptionsFor } from '../../store/selectors/wheelsSelectors';
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
    className={`flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-1 ${
      enabled ? 'bg-brand-600 justify-end' : 'bg-ink-300 justify-start'
    }`}
  >
    <span className="h-4 w-4 rounded-full bg-white shadow-sm transition-transform" />
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

  const pct = (v) => ((v - min) / (max - min)) * 100;

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
        <span className="flex items-center gap-2 font-medium text-ink-700">
          {onToggleEnabled && (
            <FilterToggle
              enabled={enabled}
              onChange={onToggleEnabled}
              ariaLabel={`Enable ${label.toLowerCase()} filter`}
            />
          )}
          {label}
        </span>
        <span className="text-ink-500 tabular-nums">
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
            className="w-24 rounded-lg border border-ink-300 px-2 py-1.5 text-sm text-center focus:border-brand-600 focus:outline-none disabled:cursor-not-allowed"
          />
          <span className="flex-1 text-center text-ink-400 text-xs select-none">
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
            className="w-24 rounded-lg border border-ink-300 px-2 py-1.5 text-sm text-center focus:border-brand-600 focus:outline-none disabled:cursor-not-allowed"
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
    <div className="border-t border-ink-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-ink-900">{title}</span>
        <svg
          className={`h-4 w-4 text-ink-500 transition-transform ${
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
const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
      active
        ? 'bg-brand-600 text-white border-brand-600'
        : 'bg-white text-ink-700 border-ink-300 hover:border-brand-600 hover:text-brand-600'
    }`}
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
  const { min, max, step } = property.filter;
  const value = filter.value; // { min, max }
  return (
    <DualRangeRow
      label={property.label}
      unit={property.unit ?? ''}
      min={min}
      max={max}
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

const MultiSelectFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  // Memoized selector by propertyId, recreated only if id changes.
  const selectOptions = useMemo(
    () => makeSelectOptionsFor(property.id),
    [property.id]
  );
  const options = useSelector(selectOptions);

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
        <span className="text-sm font-medium text-ink-700">{property.label}</span>
      </div>
      <div
        className={`flex flex-wrap gap-1.5 ${
          filter.enabled ? '' : 'opacity-50 pointer-events-none'
        }`}
      >
        {options.map((opt) => (
          <Pill
            key={String(opt)}
            active={filter.value.includes(opt)}
            onClick={() => toggle(opt)}
          >
            {String(opt)}
          </Pill>
        ))}
      </div>
    </div>
  );
};

const TriStateFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const [labelAll, labelTrue, labelFalse] = property.filter.labels;
  const set = (v) => dispatch(setFilterValue({ id: property.id, value: v }));

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
        <span className="text-sm font-medium text-ink-700">{property.label}</span>
      </div>
      <div
        className={`flex flex-wrap gap-1.5 ${
          filter.enabled ? '' : 'opacity-50 pointer-events-none'
        }`}
      >
        <Pill active={filter.value === null} onClick={() => set(null)}>
          {labelAll}
        </Pill>
        <Pill active={filter.value === true} onClick={() => set(true)}>
          {labelTrue}
        </Pill>
        <Pill active={filter.value === false} onClick={() => set(false)}>
          {labelFalse}
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
        <h3 className="text-base font-semibold text-ink-900">Filters</h3>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          Reset
        </button>
      </div>

      {/* Sort — options generated from registry */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-700">Sort by</label>
        <select
          value={sortBy ?? ''}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
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
