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
    setMinWeight: (state, action) => { state.minWeight = action.payload; },
    setMaxWeight: (state, action) => { state.maxWeight = action.payload; },
    setMinDepth: (state, action) => { state.minDepth = action.payload; },
    setMaxDepth: (state, action) => { state.maxDepth = action.payload; },
    setMinPrice: (state, action) => { state.minPrice = action.payload; },
    setMaxPrice: (state, action) => { state.maxPrice = action.payload; },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setBrandsEnabled: (state, action) => { state.brandsEnabled = action.payload; },
    setRimMaterialsEnabled: (state, action) => { state.rimMaterialsEnabled = action.payload; },
    setHooklessEnabled: (state, action) => { state.hooklessEnabled = action.payload; },
    setWeightEnabled: (state, action) => { state.weightEnabled = action.payload; },
    setDepthEnabled: (state, action) => { state.depthEnabled = action.payload; },
    setPriceEnabled: (state, action) => { state.priceEnabled = action.payload; },
    resetFilters: () => initialFiltersState,
  },
});

export const {
  setBrands,
  setRimMaterials,
  setHookless,
  setMinWeight,
  setMaxWeight,
  setMinDepth,
  setMaxDepth,
  setMinPrice,
  setMaxPrice,
  setSortBy,
  setBrandsEnabled,
  setRimMaterialsEnabled,
  setHooklessEnabled,
  setWeightEnabled,
  setDepthEnabled,
  setPriceEnabled,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
