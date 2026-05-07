import { createSlice } from '@reduxjs/toolkit';

export const initialFiltersState = {
  brands: [],
  rimMaterials: [],
  hookless: null,
  minWeight: 700,
  maxWeight: 2000,
  minDepth: 20,
  maxDepth: 80,
  minPrice: 200,
  maxPrice: 5000,
  sortBy: 'name',
  // Per-filter enable flags. When false, the corresponding filter is ignored
  // by the wheels selector regardless of its current values.
  brandsEnabled: true,
  rimMaterialsEnabled: true,
  hooklessEnabled: true,
  weightEnabled: true,
  depthEnabled: true,
  priceEnabled: true,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFiltersState,
  reducers: {
    setBrands: (state, action) => { state.brands = action.payload; },
    setRimMaterials: (state, action) => { state.rimMaterials = action.payload; },
    setHookless: (state, action) => { state.hookless = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setRange: (state, action) => {
      const { key, min, max } = action.payload;
      state[`min${key}`] = min;
      state[`max${key}`] = max;
    },
    setEnabled: (state, action) => {
      const { key, value } = action.payload;
      state[`${key}Enabled`] = value;
    },
    resetFilters: () => initialFiltersState,
  },
});

export const {
  setBrands,
  setRimMaterials,
  setHookless,
  setSortBy,
  setRange,
  setEnabled,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
