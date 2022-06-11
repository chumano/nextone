import {configureStore} from '@reduxjs/toolkit';
import thunk, {ThunkMiddleware} from 'redux-thunk';
import authReducer, {AuthState} from './auth/auth.reducer';
import callReducer from './call/callReducer';
import {CallState} from './call/callState';

export interface IAppStore {
  auth: AuthState;
  call: CallState;
}
export const appStore = configureStore<IAppStore>({
  reducer: {
    auth: authReducer,
    call: callReducer,
  },
  middleware: [thunk as ThunkMiddleware],
});

export type AppDispatch = typeof appStore.dispatch;
