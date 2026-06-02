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
    !Number.isFinite(value) || (value >= filter.value.min && value <= filter.value.max),
  multiSelect: (value, filter) =>
    filter.value.length === 0 || filter.value.includes(value),
  triState: (value, filter) =>
    filter.value === null || value === filter.value,
  multiSelectFlat: (value, filter) => {
    if (filter.value.length === 0) return true;
    if (!Array.isArray(value) || value.length === 0) return true; // null-pass
    return filter.value.some((selected) => value.includes(selected));
  },
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

      if (property.filter?.type === 'multiSelectFlat') {
        const all = [];
        for (const item of items) {
          const arr = property.accessor(item);
          if (Array.isArray(arr)) {
            for (const v of arr) {
              if (v != null) all.push(v);
            }
          }
        }
        return [...new Set(all)].sort();
      }

      return [
        ...new Set(items.map(property.accessor).filter((v) => v != null)),
      ].sort();
    }
  );

export const makeSelectContextualCountsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items, (state) => state.filters],
    (items, filtersState) => {
      const property = getPropertyById(propertyId);
      if (!property) return {};

      const otherFilterables = getFilterableProperties().filter((p) => p.id !== propertyId);

      const filteredItems = items.filter((wheel) =>
        otherFilterables.every((p) => {
          const f = filtersState.filters[p.id];
          if (!f || !f.enabled) return true;
          const matcher = matchers[p.filter.type];
          if (!matcher) return true;
          return matcher(p.accessor(wheel), f);
        })
      );

      const counts = {};
      if (property.filter?.type === 'multiSelectFlat') {
        for (const wheel of filteredItems) {
          const arr = property.accessor(wheel);
          if (Array.isArray(arr)) {
            for (const v of arr) {
              if (v != null) {
                const key = String(v);
                counts[key] = (counts[key] ?? 0) + 1;
              }
            }
          }
        }
      } else {
        for (const wheel of filteredItems) {
          const key = String(property.accessor(wheel));
          counts[key] = (counts[key] ?? 0) + 1;
        }
      }
      return counts;
    }
  );

export const makeSelectRangeBoundsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items],
    (items) => {
      const property = getPropertyById(propertyId);
      if (!property) return { min: 0, max: 0 };
      const values = items.map(property.accessor).filter(Number.isFinite);
      if (!values.length) return { min: 0, max: 0 };
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);
      const step = property.filter?.step;
      if (!step) return { min: dataMin, max: dataMax };
      return {
        min: Math.floor(dataMin / step) * step,
        max: Math.ceil(dataMax / step) * step,
      };
    }
  );
