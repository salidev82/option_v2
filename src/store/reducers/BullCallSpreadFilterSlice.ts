// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "both_ITM",
    sell_option_by: "bid_price_1",
    buy_option_by: "ask_price_1",
    max_days_to_maturity: 365,
};

const BullCallSpreadFilterSlice = createSlice({
    name: "arbitrageFilterSlice",
    initialState,
    reducers: {
        updateBullCallSpreadFilter(state, action) {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateBullCallSpreadFilter } = BullCallSpreadFilterSlice.actions;
export default BullCallSpreadFilterSlice.reducer;