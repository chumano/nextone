import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./authReducer";
import logger from 'redux-logger';
import callReducer, { CallState } from "./callReducer";
import chatReducer from "./chat/chatReducer";
import { ChatState } from "./chat/ChatState";

export interface IAppStore{
    auth : AuthState,
    call : CallState,
    chat : ChatState
}

export const store = configureStore<IAppStore>({
    reducer: {
        auth : authReducer,
        call : callReducer,
        chat : chatReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }).concat(logger) as any,
})