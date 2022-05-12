import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "oidc-client-ts";
import { IAppStore } from "../appStore";
import { AuthState } from "./AuthState";
const initialState: AuthState = {
    isLoggedIn: false,
    user : undefined
}

export const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        login: (state, action :PayloadAction<User>) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = undefined;
        }
    },
})


export const authActions = authSlice.actions;
export const getIsLoggedIn = (state: IAppStore) => state.auth.isLoggedIn;
export const getAuthState = (state: IAppStore) => state.auth;

export default authSlice.reducer;