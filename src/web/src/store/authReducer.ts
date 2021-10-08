import { createSlice } from "@reduxjs/toolkit"
import { IAppStore } from ".";

export interface AuthState {
    isLoggedIn: boolean
}

const initialState: AuthState = {
    isLoggedIn: false,
}

export const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state) => {
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.isLoggedIn = false
        }
    },
})


export const { login, logout } = authSlice.actions;
export const getIsLoggedIn = (state: IAppStore) => state.auth.isLoggedIn;
export default authSlice.reducer;