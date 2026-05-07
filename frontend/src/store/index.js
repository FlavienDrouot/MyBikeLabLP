import { configureStore } from '@reduxjs/toolkit';
import wheelsReducer from './slices/wheelsSlice';
import filtersReducer from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    wheels: wheelsReducer,
    filters: filtersReducer,
  },
});
