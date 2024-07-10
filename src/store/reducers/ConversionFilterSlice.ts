// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    write_call_based_on: "bid_price_1",
    buy_put_based_on: "ask_price_1",
    buy_stock_based_on: 'last_price'
};

const conversionFilterSlice = createSlice({
    name: "conversionFilterSlice",
    initialState,
    reducers: {
        conversionFilter(state, action) {
            return { ...state, ...action.payload };
        },
    },
});

export const { conversionFilter } = conversionFilterSlice.actions;
export default conversionFilterSlice.reducer;