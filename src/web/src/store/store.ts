import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./authReducer";

export interface IAppStore{
    auth : AuthState
}

export const store = configureStore<IAppStore>({
    reducer: {
        auth : authReducer
    },
})