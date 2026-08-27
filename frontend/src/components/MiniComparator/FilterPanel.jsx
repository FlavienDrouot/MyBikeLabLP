import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown } from 'lucide-react';
import {
  setFilterValue,
  setFilterEnabled,
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
} from '../../config/wheelProperties';
import { roundToStep, clampLow, clampHigh } from './rangeMath';
import styles from './FilterPanel.module.css';
import Icon from '../ui/Icon';

// ---------------------------------------------------------------------------
// Reusable UI primitives (unchanged from original prototype).
// ---------------------------------------------------------------------------

// Toggle switch positioned to the left of a filter label. When off, the
// filter controls fade out and the selector ignores this filter.
const FilterToggle = ({ enabled, onChange, ariaLabel }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    aria-label={ariaLabel}
    onClick={() => onChange(!enabled)}
    className={`comparator-filter-toggle flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
      enabled ? 'bg-accent justify-end' : 'bg-control-switch justify-start'
    }`}
  >
    <span className="comparator-filter-toggle-knob h-4 w-4 rounded-full bg-surface-panel transition-transform" />
  </button>
);

const RangeInput = ({ value, locale, onChange, disabled, className, ...props }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const displayValue = editing
    ? draft
    : Number(value).toLocaleString(locale, { maximumFractionDigits: 2 });

  return (
    <input
      {...props}
      type="text"
      inputMode="decimal"
      value={displayValue}
      disabled={disabled}
      onFocus={() => {
        setEditing(true);
        setDraft(String(value));
      }}
      onChange={(event) => {
        const next = event.target.value;
        setDraft(next);
        onChange(next.replace(/[^\d.-]/g, ''));
      }}
      onBlur={() => setEditing(false)}
      className={className}
    />
  );
};

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
  locale = 'en-US',
}) => {
  const computedStep = (max - min) / 50 > 1 ? 1 : 0.1;
  const effectiveStep = stepProp ?? computedStep;
  const minDiff = roundToStep(
    Math.max((max - min) / 20, effectiveStep),
    effectiveStep
  );

  const pct = (v) => (max === min ? 0 : ((v - min) / (max - min)) * 100);
  const sliderPct = (v) => 8 + pct(v) * 0.84;

  const handleLow = (raw) =>
    onChangeLow(clampLow({ raw, min, valueHigh, step: effectiveStep, minDiff }));

  const handleHigh = (raw) =>
    onChangeHigh(
      clampHigh({ raw, max, valueLow, step: effectiveStep, minDiff })
    );

  const lowZ = valueLow >= max - minDiff ? 5 : 3;

  return (
    <div className="range comparator-range-field">
      <div className="range-head comparator-range-head">
        <div className="comparator-filter-field-heading flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-content-secondary">
          {onToggleEnabled && (
            <FilterToggle
              enabled={enabled}
              onChange={onToggleEnabled}
              ariaLabel={ariaLabel}
            />
          )}
          {label}
        </div>
        <span className="range-value comparator-range-summary block font-mono text-xs text-content-secondary tabular-nums">
          {valueLow}
          {unit} - {valueHigh}
          {unit}
        </span>
      </div>
      <div className={`comparator-range-controls ${enabled ? '' : 'opacity-40'}`}>
        <div className="comparator-range-row flex items-center">
          <RangeInput
            value={valueLow}
            min={min}
            max={max}
            step={effectiveStep}
            locale={locale}
            disabled={!enabled}
            onChange={handleLow}
            className="comparator-range-input wave5-input w-24 px-2 py-1.5 text-sm text-center disabled:cursor-not-allowed"
          />
          <span className="comparator-range-separator flex-1 text-center text-content-faint text-xs select-none">
            -
          </span>
          <RangeInput
            value={valueHigh}
            min={min}
            max={max}
            step={effectiveStep}
            locale={locale}
            disabled={!enabled}
            onChange={handleHigh}
            className="comparator-range-input wave5-input w-24 px-2 py-1.5 text-sm text-center disabled:cursor-not-allowed"
          />
        </div>
        <div className="rangebar comparator-rangebar relative h-5 flex items-center">
          <div className={styles.track} />
          <div
            className={styles.range}
            style={{
              left: `${sliderPct(valueLow)}%`,
              width: `${sliderPct(valueHigh) - sliderPct(valueLow)}%`,
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

// Accordion section for one filter category. Open state is owned by FilterPanel
// so only one category can be expanded at a time.
const Section = ({ title, open, onToggle, children, first = false }) => {
  return (
    <div className={`filter-group comparator-filter-group ${first ? 'comparator-filter-group-first' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        className="filter-group-head comparator-filter-group-head"
        aria-expanded={open}
      >
        <Icon
          as={ChevronDown}
          size={16}
          aria-hidden="true"
          className={`group-collapse comparator-filter-group-icon text-content-faint transition-transform ${open ? '' : '-rotate-90'}`}
        />
        <span className="group-title comparator-filter-group-title">{title}</span>
      </button>
      {open && <div className="filter-group-body comparator-filter-group-body">{children}</div>}
    </div>
  );
};

// Pill button for multiple selections (multiSelect, triState).
const Pill = ({ active, muted, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`comparator-filter-pill
      ${active
        ? 'comparator-filter-pill-active bg-accent-wash text-accent border-accent-muted'
        : 'comparator-filter-pill-inactive bg-surface-panel text-content-secondary border-border-default hover:border-border-strong hover:text-content-primary'
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
  const { t, i18n } = useTranslation();
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
      locale={i18n.language.startsWith('fr') ? 'fr-FR' : 'en-US'}
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
    <div className="comparator-filter-field">
      <div className="comparator-filter-field-heading flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
        />
        <span className="comparator-filter-label text-[10px] font-bold uppercase tracking-[0.18em] text-content-secondary">{resolvedLabel}</span>
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
                  className="comparator-selected-filter"
                >
                  {valLabel}
                  <span aria-hidden="true" className="text-content-on-inverse/60">{'\u00D7'}</span>
                </button>
              );
            })}
          </div>
        )}
        <div className="search-field comparator-search-field">
          <input
            type="text"
            placeholder={t('filterPanel.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="comparator-search-input wave5-input mb-2 px-3 py-1.5 text-sm"
          />
        </div>
        <ul className="brand-list comparator-option-list max-h-40 overflow-y-auto filter-panel-scroll">
          {visible.map((opt) => {
            const count = counts[String(opt)] ?? 0;
            const isActive = filter.value.includes(opt);
            const isMuted = count === 0 && !isActive;
            const isAbsent = opt === null || opt === undefined || opt === '';
            const optLabel = isAbsent
              ? t('common.notAvailable')
              : property.translatable
              ? t(`${property.id}.${opt}`)
              : String(opt);
            return (
              <li key={String(opt)}>
                <label className={`fopt comparator-filter-option flex items-center gap-2 px-3 py-1.5 hover:bg-bg-recessed/60 cursor-pointer text-sm ${isMuted ? 'text-content-faint' : 'text-content-primary'}`}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggle(opt)}
                    className="h-4 w-4 rounded border-border-default accent-accent"
                  />
                  <span>{optLabel}</span>
                  <span className="fopt-count">{count}</span>
                </label>
              </li>
            );
          })}
          {visible.length === 0 && (
            <li className="comparator-filter-empty px-3 py-2 text-sm text-content-muted italic">{t('filterPanel.noResults')}</li>
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
    <div className="comparator-filter-field">
      <div className="comparator-filter-field-heading flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
        />
        <span className="comparator-filter-label text-[10px] font-bold uppercase tracking-[0.18em] text-content-secondary">{resolvedLabel}</span>
      </div>
      <div
        className={`seg comparator-filter-pills flex flex-wrap gap-1.5 ${
          filter.enabled ? '' : 'opacity-40 pointer-events-none'
        }`}
      >
        {options.map((opt) => {
          const count = counts[String(opt)] ?? 0;
          const isActive = filter.value.includes(opt);
          const isAbsent = opt === null || opt === undefined || opt === '';
          const optLabel = isAbsent
            ? t('common.notAvailable')
            : property.translatable
            ? t(`${property.id}.${opt}`)
            : String(opt);
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
    <div className="comparator-filter-field">
      <div className="comparator-filter-field-heading flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) =>
            dispatch(setFilterEnabled({ id: property.id, enabled: v }))
          }
          ariaLabel={t('filterPanel.enableFilter', { label: resolvedLabel.toLowerCase() })}
        />
        <span className="comparator-filter-label text-[10px] font-bold uppercase tracking-[0.18em] text-content-secondary">{resolvedLabel}</span>
      </div>
      <div className={`seg comparator-filter-pills flex flex-wrap gap-1.5 ${filter.enabled ? '' : 'opacity-40 pointer-events-none'}`}>
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
// Main panel - iterates over groups and filterable properties.
// ---------------------------------------------------------------------------

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const filterables = useMemo(() => getFilterableProperties(), []);
  const nonEmptyGroups = useMemo(
    () =>
      COLUMN_GROUPS.map((group) => ({
        ...group,
        properties: filterables.filter((p) => p.group === group.id),
      })).filter((group) => group.properties.length > 0),
    [filterables]
  );
  const [openGroupId, setOpenGroupId] = useState(nonEmptyGroups[0]?.id ?? null);

  return (
    <aside
      aria-label={t('filterPanel.heading')}
      className="filters-panel comparator-filters-panel card bg-surface-panel border border-border-default h-fit lg:overflow-y-auto filter-panel-scroll"
    >
      {/* Header with reset shortcut */}
      <div className="filters-top comparator-filters-top flex items-center justify-between pb-3 border-b border-border-strong">
        <h3 className="comparator-filters-title text-sm font-semibold text-content-primary tracking-[-0.01em]">{t('filterPanel.heading')}</h3>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="comparator-filter-reset text-xs font-medium text-accent hover:text-accent"
        >
          {t('filterPanel.reset')}
        </button>
      </div>

      {/* Sorting moved to clickable column headers (fix-019). */}

      {/* Filters grouped by category. First non-empty group is open by default. */}
      {nonEmptyGroups.map((group, index) => {
        const open = openGroupId === group.id;
        return (
          <Section
            key={group.id}
            title={t(group.label)}
            open={open}
            first={index === 0}
            onToggle={() => setOpenGroupId(open ? null : group.id)}
          >
            {group.properties.map((p) => (
              <div className="comparator-filter-field-wrapper" key={p.id}>
                <FilterField property={p} />
              </div>
            ))}
          </Section>
        );
      })}
    </aside>
  );
};

export default FilterPanel;
