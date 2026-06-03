import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setFilterValue,
  resetFilters,
} from '../../store/slices/filtersSlice';
import { getFilterableProperties } from '../../config/wheelProperties';

// Single chip — brass-tinted, removable.
const ActiveChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-brass-3 border border-brass-6 text-brass-11 px-2.5 py-1 rounded-xs text-xs font-medium">
    {label}
    <button
      type="button"
      aria-label={`Remove filter: ${label}`}
      onClick={onRemove}
      className="text-brass-10 font-mono text-xs leading-none cursor-pointer bg-transparent border-0 p-0"
    >
      ×
    </button>
  </span>
);

const FilterChips = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const filters = useSelector((s) => s.filters.filters);
  const filterables = useMemo(() => getFilterableProperties(), []);

  const chips = [];

  for (const property of filterables) {
    const filter = filters[property.id];
    if (!filter || !filter.enabled) continue;

    const { type } = property.filter;

    if (type === 'multiSelect' || type === 'multiSelectFlat') {
      if (!Array.isArray(filter.value) || filter.value.length === 0) continue;
      filter.value.forEach((v) => {
        const isAbsent = v === null || v === undefined || v === '';
        const valueLabel = isAbsent
          ? t('common.notAvailable')
          : property.translatable
          ? t(`${property.id}.${v}`)
          : String(v);
        chips.push({
          key: `${property.id}-${String(v)}`,
          label: `${t(property.label)}: ${valueLabel}`,
          onRemove: () => {
            const next = filter.value.filter((x) => x !== v);
            dispatch(setFilterValue({ id: property.id, value: next }));
          },
        });
      });
    }

    if (type === 'triState' && filter.value !== null) {
      const [, keyTrue, keyFalse] = property.filter.labels;
      const valueLabel = filter.value ? t(keyTrue) : t(keyFalse);
      chips.push({
        key: `${property.id}-tristate`,
        label: `${t(property.label)}: ${valueLabel}`,
        onRemove: () => dispatch(setFilterValue({ id: property.id, value: null })),
      });
    }

    // Range filter chips are excluded from this component — range filters are
    // managed exclusively via FilterPanel. If range chips are needed in a future
    // evolution, add them here with dispatch(setFilterValue({ id, value: bounds })).
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center px-5 py-3 border-b border-ink-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-7 mr-1">
        {t('filterChips.active')}
      </span>
      {chips.map((c) => (
        <ActiveChip key={c.key} label={c.label} onRemove={c.onRemove} />
      ))}
      <button
        type="button"
        onClick={() => dispatch(resetFilters())}
        className="ml-auto text-xs font-semibold uppercase tracking-[0.1em] text-ink-8 hover:text-ink-12 bg-transparent border-0 cursor-pointer p-0"
      >
        {t('filterPanel.reset')}
      </button>
    </div>
  );
};

export default FilterChips;
