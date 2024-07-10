// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ua_trade_price_by: "last_price",
  buy_option_price_by: "last_price",
  min_open_position: 0,
  max_days_to_maturity: 50,
};

const MarriedPutFilterSlice = createSlice({
  name: "MarriedPutFilterSlice",
  initialState,
  reducers: {
    updateMarriedPutFilter(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateMarriedPutFilter } = MarriedPutFilterSlice.actions;
export default MarriedPutFilterSlice.reducer;