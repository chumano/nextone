import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authReducer';
import { AuthState } from './auth/authState';
import callReducer from './call/callReducer';
import { CallState } from './call/callState';

export interface IAppStore{
    auth : AuthState,
    call: CallState
}
export const appStore = configureStore<IAppStore>({
    reducer: {
        auth: authReducer,
        call: callReducer
    }
});