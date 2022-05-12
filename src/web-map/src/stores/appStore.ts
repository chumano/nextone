import { configureStore } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import authReducer from "./auth/authReducer";
import { AuthState } from "./auth/AuthState";

export interface IAppStore{
    auth : AuthState,
}

export const appStore = configureStore<IAppStore>({
    reducer: {
        auth : authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }).concat(logger) as any,
})