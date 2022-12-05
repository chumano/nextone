import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from 'axios';
import jwtDecode from 'jwt-decode';
import qs from 'qs';

import {authApi} from '../../apis/auth.api';

import {UserLoginInfo} from '../../types/Auth/Auth.type';
import {JWTDecodeInfo} from '../../types/Auth/JWTDecodeInfo.type';
import { userApi } from '../../apis/user.api';

const loginErrorHandler = (error: AxiosError, rejectWithValue: Function) => {
  //console.log("isAxiosError: " +axios.isAxiosError(error), error)
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
      //console.log("authLogin response: " + JSON.stringify(response))
      const jwtDecodeInfo = jwtDecode(response.access_token) as JWTDecodeInfo;

      const result = {
        ...response,
        userId: jwtDecodeInfo.sub,
      };

      await AsyncStorage.setItem('@UserToken', qs.stringify(result));
      
      //checkMe
      try{
        const checkMeResponse = await userApi.checkMe();
        if(!checkMeResponse.data){
          await AsyncStorage.removeItem('@UserToken');
          return rejectWithValue('Tài khoản chưa kích hoạt');
        }
      }catch(error){
        await AsyncStorage.removeItem('@UserToken');
        return rejectWithValue('Tài khoản chưa kích hoạt');
      }

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
