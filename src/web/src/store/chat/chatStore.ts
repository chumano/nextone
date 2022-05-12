import { configureStore } from "@reduxjs/toolkit"
import logger from 'redux-logger';
import chatReducer from "./chatReducer"
import { ChatState } from "./ChatState"

export interface IChatStore{
    chat : ChatState
}

export const chatStore = configureStore<IChatStore>({

    reducer: {
        chat : chatReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
      }).concat(logger) as any,
})