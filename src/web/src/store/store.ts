import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./authReducer";
import logger from 'redux-logger';
import callReducer, { CallState } from "./callReducer";

export interface IAppStore{
    auth : AuthState,
    call : CallState
}

export const store = configureStore<IAppStore>({
    reducer: {
        auth : authReducer,
        call : callReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }).concat(logger) as any,
})