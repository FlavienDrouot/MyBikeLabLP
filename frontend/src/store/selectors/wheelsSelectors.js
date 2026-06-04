import { createSelector } from '@reduxjs/toolkit';
import {
  getFilterableProperties,
  getAllSorts,
  getPropertyById,
} from '../../config/wheelProperties';

// Filter type predicates. Adding a new filter type = add an entry here +
// a case in `buildInitialFilters` on the slice side.
export const matchers = {
  range: (value, filter) => {
    if (Array.isArray(value)) {
      return value.some(
        (v) => !Number.isFinite(v) || (v >= filter.value.min && v <= filter.value.max)
      );
    }
    return !Number.isFinite(value) || (value >= filter.value.min && value <= filter.value.max);
  },
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
  [
    (state) => state.wheels.items,
    (state) => state.filters,
    (state) => state.currency.displayCurrency,
  ],
  (items, filtersState, displayCurrency) => {
    const filterables = getFilterableProperties();
    const sort = getAllSorts().find((s) => s.id === filtersState.sortBy);
    const ctx = { displayCurrency };

    return items
      .filter((wheel) =>
        filterables.every((property) => {
          const f = filtersState.filters[property.id];
          // Filter missing from state (case of updated registry without
          // rehydration) or disabled: let it pass.
          if (!f || !f.enabled) return true;
          const matcher = matchers[property.filter.type];
          if (!matcher) return true;
          const rawValue = property.filterAccessor
            ? property.filterAccessor(wheel, ctx)
            : property.accessor(wheel, ctx);
          return matcher(rawValue, f);
        })
      )
      .slice()
      .sort((a, b) => {
        if (!sort) return 0;
        const va = sort.accessor(a, ctx);
        const vb = sort.accessor(b, ctx);
        if (sort.direction === 'localeCompare') {
          return String(va).localeCompare(String(vb));
        }
        // Missing values (null/undefined/NaN) always sort to the end,
        // regardless of direction — a wheel without a known price/weight
        // is not "cheaper" or "lighter".
        const aMissing = va == null || Number.isNaN(va);
        const bMissing = vb == null || Number.isNaN(vb);
        if (aMissing || bMissing) {
          if (aMissing && bMissing) return 0;
          return aMissing ? 1 : -1;
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
    [(state) => state.wheels.items, (state) => state.currency.displayCurrency],
    (items, displayCurrency) => {
      const property = getPropertyById(propertyId);
      if (!property) return [];
      const ctx = { displayCurrency };

      if (property.filter?.type === 'multiSelectFlat') {
        const all = [];
        for (const item of items) {
          const arr = property.accessor(item, ctx);
          if (Array.isArray(arr)) {
            for (const v of arr) {
              if (v != null) all.push(v);
            }
          }
        }
        return [...new Set(all)].sort();
      }

      return [
        ...new Set(items.map((item) => property.accessor(item, ctx)).filter((v) => v != null)),
      ].sort();
    }
  );

export const makeSelectContextualCountsFor = (propertyId) =>
  createSelector(
    [
      (state) => state.wheels.items,
      (state) => state.filters,
      (state) => state.currency.displayCurrency,
    ],
    (items, filtersState, displayCurrency) => {
      const property = getPropertyById(propertyId);
      if (!property) return {};

      const otherFilterables = getFilterableProperties().filter((p) => p.id !== propertyId);
      const ctx = { displayCurrency };

      const filteredItems = items.filter((wheel) =>
        otherFilterables.every((p) => {
          const f = filtersState.filters[p.id];
          if (!f || !f.enabled) return true;
          const matcher = matchers[p.filter.type];
          if (!matcher) return true;
          const rawValue = p.filterAccessor
            ? p.filterAccessor(wheel, ctx)
            : p.accessor(wheel, ctx);
          return matcher(rawValue, f);
        })
      );

      const counts = {};
      if (property.filter?.type === 'multiSelectFlat') {
        for (const wheel of filteredItems) {
          const arr = property.accessor(wheel, ctx);
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
          const key = String(property.accessor(wheel, ctx));
          counts[key] = (counts[key] ?? 0) + 1;
        }
      }
      return counts;
    }
  );

export const makeSelectRangeBoundsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items, (state) => state.currency.displayCurrency],
    (items, displayCurrency) => {
      const property = getPropertyById(propertyId);
      if (!property) return { min: 0, max: 0 };
      const ctx = { displayCurrency };
      const values = items.map((item) => property.accessor(item, ctx)).filter(Number.isFinite);
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
