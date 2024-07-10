// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ua_isin: null,
  strategy_id: null,
  status: "O",
  maximum_days_to_maturity: null,
  label : null,
};

const PositionsFilterSlice = createSlice({
  name: "PositionsFilterSlice",
  initialState,
  reducers: {
    updateArbitrageFilter(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateArbitrageFilter } = PositionsFilterSlice.actions;
export default PositionsFilterSlice.reducer;
