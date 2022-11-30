import {AxiosResponse} from 'axios';
import {APP_CONFIG, OAUTH_CONFIG} from './../constants/app.config';

import {UserTokenInfoResponse} from '../types/Auth/Auth.type';

import {createAxios, handleAxiosApi} from './../utils/axios.util';
import { ApiResponse } from '../types/ApiResponse.type';

const axiosInstance = createAxios(APP_CONFIG.IDENTITY_HOST);

const login = (
  username: string,
  password: string,
): Promise<UserTokenInfoResponse> => {
  const data = {...OAUTH_CONFIG, username, password};
  //console.log('APP_CONFIG.IDENTITY_HOST: '+ APP_CONFIG.IDENTITY_HOST)

  return handleAxiosApi(axiosInstance.post(`/connect/token`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }));
};

const register = (email: string, password: string, confirmPassword?: string) => {
  confirmPassword = confirmPassword || password;
  return handleAxiosApi<ApiResponse<{key:string, error:string}[]>>(axiosInstance.post('/Account/Register',{
    email,
    password, 
    confirmPassword
  }));
};

export const authApi = {
  login,
  register
};
