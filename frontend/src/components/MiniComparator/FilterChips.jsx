import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setFilterValue,
  resetFilters,
} from '../../store/slices/filtersSlice';
import { getFilterableProperties } from '../../config/wheelProperties';

// Single accent-tinted, removable chip.
const ActiveChip = ({ label, onRemove }) => (
  <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 bg-accent-wash border border-accent-muted text-accent px-2.5 py-1 rounded-xs text-xs font-medium">
    <span className="min-w-0 break-words">{label}</span>
    <button
      type="button"
      aria-label={`Remove filter: ${label}`}
      onClick={onRemove}
      className="shrink-0 text-accent font-mono text-xs leading-none cursor-pointer bg-transparent border-0 p-0"
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
    <div className="flex w-0 min-w-full gap-2 items-start px-5 py-3 border-b border-border-subtle">
      <div className="flex grow min-w-0 flex-wrap gap-2 items-center">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-content-muted mr-1">
          {t('filterChips.active')}
        </span>
        {chips.map((c) => (
          <ActiveChip key={c.key} label={c.label} onRemove={c.onRemove} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => dispatch(resetFilters())}
        className="shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-content-secondary hover:text-content-primary bg-transparent border-0 cursor-pointer p-0"
      >
        {t('filterPanel.reset')}
      </button>
    </div>
  );
};

export default FilterChips;
