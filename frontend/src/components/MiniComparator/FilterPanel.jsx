import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
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
import Icon from '../ui/Icon';

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
    className={`flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
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
  ariaLabel,
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
              ariaLabel={ariaLabel}
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
      <div className={`space-y-3 ${enabled ? '' : 'opacity-40'}`}>
        <div className="flex items-center">
          <input
            type="number"
            value={valueLow}
            min={min}
            max={max}
            step={effectiveStep}
            disabled={!enabled}
            onChange={(e) => handleLow(e.target.value)}
            className="w-24 rounded-xs border border-ink-4 px-2 py-1.5 text-sm text-center disabled:cursor-not-allowed"
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
            className="w-24 rounded-xs border border-ink-4 px-2 py-1.5 text-sm text-center disabled:cursor-not-allowed"
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
        <Icon
          as={ChevronDown}
          size={16}
          aria-hidden="true"
          className={`text-ink-6 transition-transform ${open ? 'rotate-180' : ''}`}
        />
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
    className={`px-3 py-1 rounded-xs text-xs font-medium border transition-colors
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
  const { t } = useTranslation();
  const { step } = property.filter;
  const selectBounds = useMemo(() => makeSelectRangeBoundsFor(property.id), [property.id]);
  const bounds = useSelector(selectBounds);
  const value = filter.value; // { min, max }
  const resolvedLabel = t(property.label);
  return (
    <DualRangeRow
      label={resolvedLabel}
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
      ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
    />
  );
};

const LargeMultiSelectFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  const resolvedLabel = t(property.label);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-ink-7">{resolvedLabel}</span>
      </div>
      <div className={filter.enabled ? '' : 'opacity-40 pointer-events-none'}>
        {filter.value.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {filter.value.map((v) => {
              const valLabel = property.translatable ? t(`${property.id}.${v}`) : String(v);
              return (
                <button
                  key={String(v)}
                  type="button"
                  onClick={() => toggle(v)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium bg-brass-7 text-ink-12 hover:bg-brass-8 transition-colors"
                >
                  {valLabel}
                  <span aria-hidden="true" className="text-ink-12/60">×</span>
                </button>
              );
            })}
          </div>
        )}
        <input
          type="text"
          placeholder={t('filterPanel.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xs border border-ink-4 px-3 py-1.5 text-sm mb-2"
        />
        <ul className="max-h-40 overflow-y-auto rounded-none border border-ink-4 filter-panel-scroll">
          {visible.map((opt) => {
            const count = counts[String(opt)] ?? 0;
            const isActive = filter.value.includes(opt);
            const isMuted = count === 0 && !isActive;
            const optLabel = property.translatable ? t(`${property.id}.${opt}`) : String(opt);
            return (
              <li key={String(opt)}>
                <label className={`flex items-center gap-2 px-3 py-1.5 hover:bg-ink-2/60 cursor-pointer text-sm ${isMuted ? 'text-ink-4' : 'text-ink-11'}`}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggle(opt)}
                    className="h-4 w-4 rounded border-ink-4 accent-brass-7"
                  />
                  {optLabel} ({count})
                </label>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="px-3 py-2 text-sm text-ink-500 italic">{t('filterPanel.noResults')}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

const MultiSelectFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  const resolvedLabel = t(property.label);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-ink-7">{resolvedLabel}</span>
      </div>
      <div
        className={`flex flex-wrap gap-1.5 ${
          filter.enabled ? '' : 'opacity-40 pointer-events-none'
        }`}
      >
        {options.map((opt) => {
          const count = counts[String(opt)] ?? 0;
          const isActive = filter.value.includes(opt);
          const optLabel = property.translatable ? t(`${property.id}.${opt}`) : String(opt);
          return (
            <Pill
              key={String(opt)}
              active={isActive}
              muted={count === 0 && !isActive}
              onClick={() => toggle(opt)}
            >
              {optLabel} ({count})
            </Pill>
          );
        })}
      </div>
    </div>
  );
};

const TriStateFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [keyAll, keyTrue, keyFalse] = property.filter.labels;
  const labelAll = t(keyAll);
  const labelTrue = t(keyTrue);
  const labelFalse = t(keyFalse);
  const set = (v) => dispatch(setFilterValue({ id: property.id, value: v }));

  const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
  const counts = useSelector(selectCounts);
  const trueCount = counts['true'] ?? 0;
  const falseCount = counts['false'] ?? 0;

  const resolvedLabel = t(property.label);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
        />
        <span className="text-xs font-medium uppercase tracking-widest text-ink-7">{resolvedLabel}</span>
      </div>
      <div className={`flex flex-wrap gap-1.5 ${filter.enabled ? '' : 'opacity-40 pointer-events-none'}`}>
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
  multiSelectFlat: MultiSelectFilter,
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
  const { t } = useTranslation();
  const sortBy = useSelector((s) => s.filters.sortBy);
  const sorts = useMemo(() => getAllSorts(), []);
  const filterables = useMemo(() => getFilterableProperties(), []);

  return (
    <aside
      className="card p-5 lg:p-6 space-y-6 h-fit lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-y-auto filter-panel-scroll"
    >
      {/* Header with reset shortcut */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-11">{t('filterPanel.heading')}</h3>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-xs font-medium text-brass-8 hover:text-brass-9"
        >
          {t('filterPanel.reset')}
        </button>
      </div>

      {/* Sort — options generated from registry */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-11">{t('filterPanel.sortBy')}</label>
        <select
          value={sortBy ?? ''}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm"
        >
          {sorts.map((s) => (
            <option key={s.id} value={s.id}>
              {t(s.label)}
            </option>
          ))}
        </select>
      </div>

      {/* Filters grouped by category — first group (general) open by default */}
      {COLUMN_GROUPS.map((group, idx) => {
        const props = filterables.filter((p) => p.group === group.id);
        if (props.length === 0) return null;
        return (
          <Section key={group.id} title={t(group.label)} defaultOpen={idx === 0}>
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
