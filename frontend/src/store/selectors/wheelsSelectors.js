import { createSelector } from '@reduxjs/toolkit';
import {
  getFilterableProperties,
  getAllSorts,
  getPropertyById,
  minPrice,
} from '../../config/wheelProperties';

// `minPrice` is re-exported from the registry to maintain backward compatibility
// with potential third-party imports (e.g. used in future tests).
export { minPrice };

// Filter type predicates. Adding a new filter type = add an entry here +
// a case in `buildInitialFilters` on the slice side.
const matchers = {
  range: (value, filter) =>
    value >= filter.value.min && value <= filter.value.max,
  multiSelect: (value, filter) =>
    filter.value.length === 0 || filter.value.includes(value),
  triState: (value, filter) =>
    filter.value === null || value === filter.value,
};

// Main selector: filters then sorts the wheel list by looping over the registry.
// No filters are hardcoded here.
export const selectFilteredWheels = createSelector(
  [(state) => state.wheels.items, (state) => state.filters],
  (items, filtersState) => {
    const filterables = getFilterableProperties();
    const sort = getAllSorts().find((s) => s.id === filtersState.sortBy);

    return items
      .filter((wheel) =>
        filterables.every((property) => {
          const f = filtersState.filters[property.id];
          // Filter missing from state (case of updated registry without
          // rehydration) or disabled: let it pass.
          if (!f || !f.enabled) return true;
          const matcher = matchers[property.filter.type];
          if (!matcher) return true;
          return matcher(property.accessor(wheel), f);
        })
      )
      .slice()
      .sort((a, b) => {
        if (!sort) return 0;
        const va = sort.accessor(a);
        const vb = sort.accessor(b);
        if (sort.direction === 'localeCompare') {
          return String(va).localeCompare(String(vb));
        }
        return sort.direction === 'asc' ? va - vb : vb - va;
      });
  }
);

// Parameterized selector: returns the sorted, deduplicated list of values
// for a given property, computed from the current catalog.
// Replaces old selectAllBrands / selectAllRimMaterials.
//
// Usage:
//   const allBrands = useSelector(useMemo(() => makeSelectOptionsFor('brand'), []));
// or more simply via the useOptionsFor hook (cf. FilterPanel).
export const makeSelectOptionsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items],
    (items) => {
      const property = getPropertyById(propertyId);
      if (!property) return [];
      return [...new Set(items.map(property.accessor))].sort();
    }
  );
