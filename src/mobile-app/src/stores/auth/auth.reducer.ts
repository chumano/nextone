import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import qs from 'qs';

import {authApi} from '../../apis/auth.api';

import {UserLoginInfo} from '../../types/Auth.type';
import {UserTokenInfo} from './../../types/Auth.type';
import {GenericState} from './../../types/GenericState.type';

export interface AuthState extends GenericState<UserTokenInfo> {
  IsUserLogin: boolean;
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
  async ({Email, Password}: UserLoginInfo, {rejectWithValue}) => {
    try {
      const response = await authApi.login(Email, Password);
      await AsyncStorage.setItem('@UserToken', qs.stringify(response.data));
      return response.data;
    } catch (error) {
      const loginErrors = error as AxiosError;
      return loginErrorHandler(loginErrors, rejectWithValue);
    }
  },
);

const authInitialState: AuthState = {
  IsUserLogin: false,
  Data: null,
  Status: 'pending',
  Error: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    loginWithStorage(state, action) {
      state.Data = action.payload;
      state.IsUserLogin = true;
    },
    logout(state) {
      state.IsUserLogin = false;
      state.Data = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(authLogin.pending, state => {
      state.Status = 'loading';
    });
    builder.addCase(authLogin.fulfilled, (state, action) => {
      const {access_token, refresh_token, expire_in, scope, token_type} =
        action.payload;
      state.Data = {
        AccessToken: access_token,
        RefreshToken: refresh_token,
        ExpiresIn: expire_in,
        Scope: scope,
        TokenType: token_type,
      };
      state.Status = 'success';
      state.IsUserLogin = true;
    });
    builder.addCase(authLogin.rejected, (state, action) => {
      state.Error = action.payload as string;
      state.Status = 'failed';
    });
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
