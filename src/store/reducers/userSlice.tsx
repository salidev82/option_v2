import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
    user: null
}

const initialState: CounterState = {
    user: null
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<any>) => {
            state.user = action.payload
        },
        updateAccessToken: (state, action) => {
            state.user.access_token = action.payload;
        },
        logout: (state) => {
            state.user = null
        },
        setRoles: (state, action) => {
            state.user.user.roles = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { login, updateAccessToken, logout, setRoles } = userSlice.actions

export default userSlice.reducer