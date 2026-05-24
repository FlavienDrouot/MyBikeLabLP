import { createSlice } from '@reduxjs/toolkit';
import {
  getFilterableProperties,
  getDefaultSortId,
} from '../../config/wheelProperties';
import { wheelsData } from '../../data/wheelsData';

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
        const values = wheelsData
          .map((w) => property.accessor(w))
          .filter(Number.isFinite);
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
  sortBy: getDefaultSortId(),
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
    resetFilters: () => buildInitialState(),
  },
});

export const {
  setFilterValue,
  setFilterEnabled,
  setSortBy,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
