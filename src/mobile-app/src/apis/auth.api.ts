import {AxiosResponse} from 'axios';
import {APP_CONFIG, OAUTH_CONFIG} from './../constants/app.config';

import {UserTokenInfoResponse} from '../types/Auth/Auth.type';

import {createAxios} from './../utils/axios.util';

const axiosInstance = createAxios(APP_CONFIG.IDENTITY_HOST);

const login = (
  username: string,
  password: string,
): Promise<AxiosResponse<UserTokenInfoResponse>> => {
  const data = {...OAUTH_CONFIG, username, password};
  //console.log('APP_CONFIG.IDENTITY_HOST: '+ APP_CONFIG.IDENTITY_HOST)

  return axiosInstance.post(`/connect/token`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

const register = () => {
  return axiosInstance.post('');
};

export const authApi = {
  login,
};
