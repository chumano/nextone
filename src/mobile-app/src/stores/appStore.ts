import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authReducer';
import { AuthState } from './auth/authState';

export interface IAppStore{
    auth : AuthState
}
export const appStore = configureStore<IAppStore>({
    reducer: {
        auth: authReducer
    }
});