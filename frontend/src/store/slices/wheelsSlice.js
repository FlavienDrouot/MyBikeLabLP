import { createSlice } from '@reduxjs/toolkit';
import { wheelsData } from '../../data/wheelsData';

const wheelsSlice = createSlice({
  name: 'wheels',
  initialState: {
    items: wheelsData,
    // Reserved for future backend integration with async thunks
    loading: false,
    error: null,
  },
  reducers: {},
});

export default wheelsSlice.reducer;
