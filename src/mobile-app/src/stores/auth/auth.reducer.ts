import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authInitialState} from './auth.state';
import {authLogin, logout} from './auth.thunk';

import {UserTokenInfo, UserTokenInfoResponse} from '../../types/Auth/Auth.type';

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loginWithStorage(state, action: PayloadAction<UserTokenInfo>) {
      state.data = action.payload;
      state.isUserLogin = true;
      state.status = 'success';
    },
    loginWithRefreshToken(state, action: PayloadAction<UserTokenInfoResponse>) {
      const {
        access_token,
        expire_in,
        refresh_token,
        id_token,
        token_type,
        scope,
      } = action.payload;
      if (!state.data) return;
      if (!id_token) return;
      state.data = {
        accessToken: access_token,
        expiresIn: expire_in,
        refreshToken: refresh_token,
        userId: id_token,
        tokenType: token_type,
        scope: scope,
      };
      state.isUserLogin = true;
      state.status = 'success';
    },
  },
  extraReducers: builder => {
    builder.addCase(authLogin.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(
      authLogin.fulfilled,
      (
        state,
        action: PayloadAction<UserTokenInfoResponse & {userId: string}>,
      ) => {
        const {
          access_token,
          refresh_token,
          expire_in,
          scope,
          token_type,
          userId,
        } = action.payload;
        state.data = {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expire_in,
          scope: scope,
          tokenType: token_type,
          userId,
        };
        state.status = 'success';
        state.error = null;
        state.isUserLogin = true;
      },
    );
    builder.addCase(authLogin.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });
    builder.addCase(logout.pending, state => {});
    builder.addCase(logout.fulfilled, state => {
      state.isUserLogin = false;
      state.data = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload as string;
      state.isUserLogin = false;
      state.data = null;
      state.status = 'failed';
    });
  },
});

export default authSlice.reducer;
