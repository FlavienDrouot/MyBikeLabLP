import { useMemo } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setFilterValue,
  resetFilters,
} from '../../store/slices/filtersSlice';
import { getFilterableProperties } from '../../config/wheelProperties';
import { makeSelectRangeBoundsFor } from '../../store/selectors/wheelsSelectors';

// Wave 5 filter pill: a quiet default surface with the selected value
// emphasized, plus a removable affordance for active filters.
const ActiveChip = ({ label, value, onRemove }) => (
  <span className="fchip comparator-filter-chip active">
    <span className="min-w-0 break-words">
      {label} <b>{value}</b>
    </span>
    <button
      type="button"
      aria-label={`Remove filter: ${label}: ${value}`}
      onClick={onRemove}
      className="comparator-filter-chip-remove"
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
  const rangeSelectors = useMemo(
    () => Object.fromEntries(
      filterables
        .filter((property) => property.filter?.type === 'range')
        .map((property) => [property.id, makeSelectRangeBoundsFor(property.id)])
    ),
    [filterables]
  );
  const selectRangeBounds = useMemo(
    () => createSelector(
      Object.values(rangeSelectors),
      (...bounds) => Object.fromEntries(
        Object.keys(rangeSelectors).map((id, index) => [id, bounds[index]])
      )
    ),
    [rangeSelectors]
  );
  const rangeBounds = useSelector(selectRangeBounds);

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
          label: t(property.label),
          value: valueLabel,
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
        label: t(property.label),
        value: valueLabel,
        onRemove: () => dispatch(setFilterValue({ id: property.id, value: null })),
      });
    }

    if (type === 'range') {
      const bounds = rangeBounds[property.id];
      const isActive = bounds && (
        filter.value.min !== bounds.min || filter.value.max !== bounds.max
      );
      if (isActive && bounds.max !== 0) {
        chips.push({
          key: `${property.id}-range`,
          label: t(property.label),
          value: `${filter.value.min}${property.unit ?? ''} – ${filter.value.max}${property.unit ?? ''}`,
          onRemove: () => dispatch(setFilterValue({ id: property.id, value: bounds })),
        });
      }
    }
  }

  return (
    <div className="filter-strip comparator-filter-strip">
      <div className="flex grow min-w-0 flex-wrap gap-2 items-center">
        <span className="flabel comparator-filter-strip-label">
          {t('filterPanel.heading')}
        </span>
        {chips.length > 0
          ? chips.map((c) => (
              <ActiveChip key={c.key} label={c.label} value={c.value} onRemove={c.onRemove} />
            ))
          : <span className="comparator-filter-strip-empty">{t('filterChips.none')}</span>}
      </div>
      <button
        type="button"
        onClick={() => dispatch(resetFilters())}
        className="comparator-filter-strip-reset"
      >
        {t('filterPanel.reset')}
      </button>
    </div>
  );
};

export default FilterChips;
