// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    option_type: "both",
    ua_trade_price_by: "last_price",
    buy_option_price_by: "ask_price_1",
    active: false,
    min_open_position: 0,
    max_days_to_maturity: 20,
};

const arbitrageFilterSlice = createSlice({
    name: "arbitrageFilterSlice",
    initialState,
    reducers: {
        updateArbitrageFilter(state, action) {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateArbitrageFilter } = arbitrageFilterSlice.actions;
export default arbitrageFilterSlice.reducer;