import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_CURRENCY, isSupportedCurrency } from '../../domain/currency';

// Holds the active display currency. Not persisted: the app resets to the
// default currency (EUR) on every load.
const initialState = {
  displayCurrency: DEFAULT_CURRENCY,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    // Sets the display currency, ignoring unsupported values defensively.
    setDisplayCurrency: (state, action) => {
      if (isSupportedCurrency(action.payload)) {
        state.displayCurrency = action.payload;
      }
    },
  },
});

export const { setDisplayCurrency } = currencySlice.actions;

export default currencySlice.reducer;
