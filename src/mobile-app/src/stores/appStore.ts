import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authReducer';

export const appStore = configureStore({
    reducer: {
        auth: authReducer
    }
});