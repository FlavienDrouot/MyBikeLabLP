import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBrands,
  setRimMaterials,
  setHookless,
  setSortBy,
  setRange,
  setEnabled,
  resetFilters,
} from '../../store/slices/filtersSlice';
import {
  selectAllBrands,
  selectAllRimMaterials,
} from '../../store/selectors/wheelsSelectors';
import { roundToStep, clampLow, clampHigh } from './rangeMath';
import styles from './FilterPanel.module.css';

// Toggle switch placed at the left of every filter label. When off, the parent
// block dims its controls and the selector skips the filter.
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
  const minDiff = roundToStep(Math.max((max - min) / 20, effectiveStep), effectiveStep);

  const pct = (v) => ((v - min) / (max - min)) * 100;

  const handleLow = (raw) =>
    onChangeLow(clampLow({ raw, min, valueHigh, step: effectiveStep, minDiff }));

  const handleHigh = (raw) =>
    onChangeHigh(clampHigh({ raw, max, valueLow, step: effectiveStep, minDiff }));

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
          {valueLow}{unit} — {valueHigh}{unit}
        </span>
      </div>
      <div className={`space-y-3 ${enabled ? '' : 'opacity-50'}`}>
        <div className="flex items-center">
          <input
            type="number"
            value={valueLow}
            min={min} max={max} step={effectiveStep}
            disabled={!enabled}
            onChange={(e) => handleLow(e.target.value)}
            className="w-24 rounded-lg border border-ink-300 px-2 py-1.5 text-sm text-center focus:border-brand-600 focus:outline-none disabled:cursor-not-allowed"
          />
          <span className="flex-1 text-center text-ink-400 text-xs select-none">—</span>
          <input
            type="number"
            value={valueHigh}
            min={min} max={max} step={effectiveStep}
            disabled={!enabled}
            onChange={(e) => handleHigh(e.target.value)}
            className="w-24 rounded-lg border border-ink-300 px-2 py-1.5 text-sm text-center focus:border-brand-600 focus:outline-none disabled:cursor-not-allowed"
          />
        </div>
        <div className="relative h-5 flex items-center">
          <div className={styles.track} />
          <div
            className={styles.range}
            style={{ left: `${pct(valueLow)}%`, width: `${pct(valueHigh) - pct(valueLow)}%` }}
          />
          <input
            type="range"
            className={styles.thumb}
            min={min} max={max} step={effectiveStep}
            value={valueLow}
            disabled={!enabled}
            onChange={(e) => handleLow(e.target.value)}
            style={{ zIndex: lowZ }}
          />
          <input
            type="range"
            className={styles.thumb}
            min={min} max={max} step={effectiveStep}
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

// Collapsible group header used to fold/unfold a category of filters
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
          className={`h-4 w-4 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && <div className="mt-4 space-y-5">{children}</div>}
    </div>
  );
};

// Toggle button used for multi-select filter groups (brands, materials, hookless)
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

// Sticky sidebar that drives all wheel list filtering and sorting via Redux
const FilterPanel = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  // Derived lists of every brand / material present in the catalogue
  const allBrands = useSelector(selectAllBrands);
  const allMaterials = useSelector(selectAllRimMaterials);

  // Adds or removes a value from a filter array, then dispatches the result
  const toggleArrayValue = (action, current, value) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    dispatch(action(next));
  };

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

      {/* Sort order */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-700">Sort by</label>
        <select
          value={filters.sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
        >
          <option value="name">Name (A → Z)</option>
          <option value="weight_asc">Weight (light → heavy)</option>
          <option value="weight_desc">Weight (heavy → light)</option>
          <option value="price_asc">Price (low → high)</option>
          <option value="price_desc">Price (high → low)</option>
          <option value="depth_asc">Depth (shallow → deep)</option>
          <option value="depth_desc">Depth (deep → shallow)</option>
        </select>
      </div>

      <Section title="General specs" defaultOpen={true}>
        {/* Multi-select brand pills — empty selection means "all brands" */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterToggle
              enabled={filters.brandsEnabled}
              onChange={(v) => dispatch(setEnabled({key: 'brands', value: v}))}
              ariaLabel="Enable brand filter"
            />
            <span className="text-sm font-medium text-ink-700">Brand</span>
          </div>
          <div
            className={`flex flex-wrap gap-1.5 ${
              filters.brandsEnabled ? '' : 'opacity-50 pointer-events-none'
            }`}
          >
            {allBrands.map((b) => (
              <Pill
                key={b}
                active={filters.brands.includes(b)}
                onClick={() => toggleArrayValue(setBrands, filters.brands, b)}
              >
                {b}
              </Pill>
            ))}
          </div>
        </div>

        <DualRangeRow
          label="Weight" unit=" g"
          min={700} max={2000} step={10}
          valueLow={filters.minWeight} valueHigh={filters.maxWeight}
          onChangeLow={(v) => dispatch(setRange({key: 'Weight', min: v, max: filters.maxWeight}))}
          onChangeHigh={(v) => dispatch(setRange({key: 'Weight', min: filters.minWeight, max: v}))}
          enabled={filters.weightEnabled}
          onToggleEnabled={(v) => dispatch(setEnabled({key: 'weight', value: v}))}
        />
        <DualRangeRow
          label="Price" unit=" €"
          min={200} max={5000} step={50}
          valueLow={filters.minPrice} valueHigh={filters.maxPrice}
          onChangeLow={(v) => dispatch(setRange({key: 'Price', min: v, max: filters.maxPrice}))}
          onChangeHigh={(v) => dispatch(setRange({key: 'Price', min: filters.minPrice, max: v}))}
          enabled={filters.priceEnabled}
          onToggleEnabled={(v) => dispatch(setEnabled({key: 'price', value: v}))}
        />
      </Section>

      <Section title="Rims" defaultOpen={false}>
        {/* Multi-select rim material pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterToggle
              enabled={filters.rimMaterialsEnabled}
              onChange={(v) => dispatch(setEnabled({key: 'rimMaterials', value: v}))}
              ariaLabel="Enable rim material filter"
            />
            <span className="text-sm font-medium text-ink-700">Rim material</span>
          </div>
          <div
            className={`flex flex-wrap gap-1.5 ${
              filters.rimMaterialsEnabled ? '' : 'opacity-50 pointer-events-none'
            }`}
          >
            {allMaterials.map((m) => (
              <Pill
                key={m}
                active={filters.rimMaterials.includes(m)}
                onClick={() =>
                  toggleArrayValue(setRimMaterials, filters.rimMaterials, m)
                }
              >
                {m}
              </Pill>
            ))}
          </div>
        </div>

        {/* Hookless compatibility — null means no preference */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilterToggle
              enabled={filters.hooklessEnabled}
              onChange={(v) => dispatch(setEnabled({key: 'hookless', value: v}))}
              ariaLabel="Enable hookless filter"
            />
            <span className="text-sm font-medium text-ink-700">Hookless</span>
          </div>
          <div
            className={`flex flex-wrap gap-1.5 ${
              filters.hooklessEnabled ? '' : 'opacity-50 pointer-events-none'
            }`}
          >
            <Pill active={filters.hookless === null} onClick={() => dispatch(setHookless(null))}>
              All
            </Pill>
            <Pill active={filters.hookless === true} onClick={() => dispatch(setHookless(true))}>
              Hookless
            </Pill>
            <Pill active={filters.hookless === false} onClick={() => dispatch(setHookless(false))}>
              Hooked
            </Pill>
          </div>
        </div>

        <DualRangeRow
          label="Depth" unit=" mm"
          min={20} max={80}
          valueLow={filters.minDepth} valueHigh={filters.maxDepth}
          onChangeLow={(v) => dispatch(setRange({key: 'Depth', min: v, max: filters.maxDepth}))}
          onChangeHigh={(v) => dispatch(setRange({key: 'Depth', min: filters.minDepth, max: v}))}
          enabled={filters.depthEnabled}
          onToggleEnabled={(v) => dispatch(setEnabled({key: 'depth', value: v}))}
        />
      </Section>
    </aside>
  );
};

export default FilterPanel;
