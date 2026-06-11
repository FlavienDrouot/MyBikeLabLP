import { createSlice } from '@reduxjs/toolkit';
import { getFilterableProperties } from '../../config/wheelProperties';
import { wheelsData } from '../../data/wheelsData';
import { convert, DEFAULT_CURRENCY } from '../../lib/currency';
import { collectRangeBoundValuesForItems } from '../rangeBounds';
import { setDisplayCurrency } from './currencySlice';

// State dynamically generated from the wheel properties registry.
// Shape:
//   {
//     filters: { [propertyId]: { value, enabled } },
//     sortBy: string,
//   }
//
// Initial `value` depends on filter type:
//   - range       : { min, max } (default bounds from spec)
//   - multiSelect : [] (empty array = "all")
//   - triState    : null (= no preference)

const buildInitialFilters = () => {
  const filters = {};
  for (const property of getFilterableProperties()) {
    let value;
    switch (property.filter.type) {
      case 'range': {
        // Initial bounds are computed in the default display currency.
        const ctx = { displayCurrency: DEFAULT_CURRENCY };
        const values = collectRangeBoundValuesForItems(property, wheelsData, ctx);
        const step = property.filter.step;
        const dataMin = values.length ? Math.min(...values) : 0;
        const dataMax = values.length ? Math.max(...values) : 0;
        value = {
          min: (step && values.length) ? Math.floor(dataMin / step) * step : dataMin,
          max: (step && values.length) ? Math.ceil(dataMax / step) * step : dataMax,
        };
        break;
      }
      case 'multiSelect':
        value = [];
        break;
      case 'multiSelectFlat':
        value = [];
        break;
      case 'triState':
        value = null;
        break;
      default:
        value = null;
    }
    filters[property.id] = { value, enabled: true };
  }
  return filters;
};

export const buildInitialState = () => ({
  filters: buildInitialFilters(),
  // No active sort on load: rows appear in catalog order. `null` is the
  // canonical "no sort" value (selectFilteredWheels falls back to a stable
  // sort) and is also the reset target of the column-header sort cycle.
  sortBy: null,
});

const filtersSlice = createSlice({
  name: 'filters',
  initialState: buildInitialState(),
  reducers: {
    // Updates filter value (range = {min,max}, multiSelect = [], triState = bool|null)
    setFilterValue: (state, action) => {
      const { id, value } = action.payload;
      if (state.filters[id]) {
        state.filters[id].value = value;
      }
    },
    // Enables or disables a filter without losing its current value.
    setFilterEnabled: (state, action) => {
      const { id, enabled } = action.payload;
      if (state.filters[id]) {
        state.filters[id].enabled = enabled;
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    // Re-expresses every enabled monetary range filter's stored { min, max }
    // into a new display currency on a currency switch (AD-004). Iterates the
    // registry by the `monetary` flag — no hardcoded property id.
    reexpressMonetaryFilters: (state, action) => {
      const { from, to } = action.payload;
      if (from === to) return;
      for (const property of getFilterableProperties()) {
        if (!property.monetary || property.filter.type !== 'range') continue;
        const entry = state.filters[property.id];
        if (!entry || !entry.value) continue;
        const step = property.filter.step;
        const reexpress = (v) => {
          const converted = convert(v, from, to);
          if (!Number.isFinite(converted)) return v;
          return step ? Math.round(converted / step) * step : converted;
        };
        entry.value = {
          min: reexpress(entry.value.min),
          max: reexpress(entry.value.max),
        };
      }
    },
    resetFilters: () => buildInitialState(),
  },
});

export const {
  setFilterValue,
  setFilterEnabled,
  setSortBy,
  reexpressMonetaryFilters,
  resetFilters,
} = filtersSlice.actions;

// Switches the display currency and keeps the monetary filter selection
// consistent: set the new currency, then re-express the stored range bounds.
export const changeDisplayCurrency = (next) => (dispatch, getState) => {
  const from = getState().currency.displayCurrency;
  if (from === next) return;
  dispatch(setDisplayCurrency(next));
  dispatch(reexpressMonetaryFilters({ from, to: next }));
};

export default filtersSlice.reducer;
