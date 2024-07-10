// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    write_option_based_on: "bid_price_1",
    ua_tse_code: "0",
    min_total_trade_value: 0,
    min_cc_traded_value: 0,
};

const coveredFilterSlice = createSlice({
    name: "coveredCallFilter",
    initialState,
    reducers: {
        updateCoveredFilter(state, action) {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateCoveredFilter } = coveredFilterSlice.actions;
export default coveredFilterSlice.reducer;