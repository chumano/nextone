import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {AxiosError} from 'axios';
import qs from 'qs';

import {authApi} from '../../apis/auth.api';
import jwtDecode from 'jwt-decode';

import {UserLoginInfo} from '../../types/Auth/Auth.type';
import {UserTokenInfo, UserTokenInfoResponse} from '../../types/Auth/Auth.type';
import {JWTDecodeInfo} from '../../types/Auth/JWTDecodeInfo.type';

import {GenericState} from './../../types/GenericState.type';

export interface AuthState extends GenericState<UserTokenInfo> {
  isUserLogin: boolean;
}

const loginErrorHandler = (error: AxiosError, rejectWithValue: Function) => {
  if (error.response?.status) {
    if (error.response.status < 200 || error.response.status > 400) {
      return rejectWithValue('Something went wrong, Please try again');
    }

    if (error.response.status === 400) {
      const errorResponseArray: string[] = [];
      for (const value of Object.values(error.response.data)) {
        errorResponseArray.push(value as string);
      }

      const userAndPasswordInvalid = errorResponseArray.includes(
        'invalid_username_or_password',
      );

      if (userAndPasswordInvalid) {
        return rejectWithValue('Invalid login or password.');
      }
    }
  }

  return rejectWithValue('Something went wrong, Please try again');
};

export const authLogin = createAsyncThunk(
  'auth/login',
  async ({email, password}: UserLoginInfo, {rejectWithValue}) => {
    try {
      const response = await authApi.login(email, password);
      const jwtDecodeInfo = jwtDecode(
        response.data.access_token,
      ) as JWTDecodeInfo;

      const result = {
        ...response.data,
        userId: jwtDecodeInfo.sub,
      };

      await AsyncStorage.setItem('@UserToken', qs.stringify(result));

      return result;
    } catch (error) {
      const loginErrors = error as AxiosError;
      return loginErrorHandler(loginErrors, rejectWithValue);
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, {rejectWithValue}) => {
    try {
      await AsyncStorage.removeItem('@UserToken');
      return;
    } catch (error) {
      return rejectWithValue('Something went wrong');
    }
  },
);

const authInitialState: AuthState = {
  isUserLogin: false,
  data: null,
  status: 'pending',
  error: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loginWithStorage(state, action: PayloadAction<UserTokenInfo>) {
      state.data = action.payload;
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
      state.error = 'failed';
    });
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
