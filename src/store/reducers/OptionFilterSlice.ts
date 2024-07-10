// optionsFilterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ua_tse_code: "0",
    min_open_position: 0,
    maximum_days_to_maturity: 365,
    option_type: "both",
};

const optionsFilterSlice = createSlice({
    name: "optionsFilter",
    initialState,
    reducers: {
        updateOptionsFilter(state, action) {
            return { ...state, ...action.payload };
        },
    },
});

export const { updateOptionsFilter } = optionsFilterSlice.actions;
export default optionsFilterSlice.reducer;