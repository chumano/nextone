import {authActions} from './../stores/auth/auth.actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
import {AxiosResponse} from 'axios';
import {UserTokenInfoResponse} from '../types/Auth/Auth.type';
import {APP_CONFIG, OAUTH_REFRESH_TOKEN_CONFIG} from '../constants/app.config';
import {appStore} from '../stores/app.store';
import { logout } from '../stores/auth';

export const createAxios = (baseUrl: string) => {
  const newInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      Accept: 'application/json',
    },
    paramsSerializer: params => {
      return qs.stringify(params);
    },
    timeout: 5000,
  });

  newInstance.interceptors.request.use(
    async request => {
      const userTokenInfoString = await AsyncStorage.getItem('@UserToken');
      if (userTokenInfoString) {
        const userTokenInfoResponse = qs.parse(
          userTokenInfoString,
        ) as unknown as UserTokenInfoResponse;
        request.headers.Authorization = `Bearer ${userTokenInfoResponse.access_token}`;
      }

      if (
        request.data &&
        request.headers['Content-Type'] === 'application/x-www-form-urlencoded'
      ) {
        request.data = qs.stringify(request.data);
      }

      return request;
    },
    async error => {
      return Promise.reject(error);
    },
  );

  newInstance.interceptors.response.use(
    response => response,
    async error => {
      //console.log('axios interceptors error', JSON.stringify(error));
      // error 401
      let originalConfig = error.config;
      if (error?.response?.status === 401) {
        const userTokenInfoString = await AsyncStorage.getItem('@UserToken');
        if (!userTokenInfoString) {
          //logout
          appStore.dispatch(logout())
          return;
        }

        //console.log('401-> refresh token')
        try {
          const userTokenInfoResponse = qs.parse(userTokenInfoString) as unknown as UserTokenInfoResponse;
          const respRefresh = await handleRefresh(userTokenInfoResponse.refresh_token, );
          //console.log('refresh token response', respRefresh);
          if (respRefresh && respRefresh.status === 200) {
            const data = respRefresh.data;
          
            AsyncStorage.setItem('@UserToken', qs.stringify(data));
            appStore.dispatch(authActions.loginWithRefreshToken(data));
          }

          return newInstance(originalConfig);
        } catch (error) {
          console.error('refresh token error',error);
          //logout
          appStore.dispatch(logout())
        }
        return;
      }

      return Promise.reject(error);
    },
  );

  return newInstance;
};

export async function handleAxiosApi<T>(
  axiosPromises: Promise<AxiosResponse<any>> | Promise<AxiosResponse<any>>[],
): Promise<T> {
  axiosPromises = Array.isArray(axiosPromises)
    ? axiosPromises
    : [axiosPromises];

  if (axiosPromises.length === 1) {
    const {data} = await axiosPromises[0];
    return data;
  }

  return Promise.all(
    axiosPromises.map(async promise => {
      const {data} = await promise;
      return data;
    }),
  ) as any;
}

const axiosServiceRefresh = axios.create({
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  },
});
const handleRefresh = async (
  refreshToken: string,
): Promise<AxiosResponse<UserTokenInfoResponse>> => {
  // set header for axios refresh
  // axiosServiceRefresh.defaults.headers.common.Authorization = `Bearer ${token}`;
  const data = qs.stringify({
    ...OAUTH_REFRESH_TOKEN_CONFIG,
    refresh_token: refreshToken,
  });

  return axiosServiceRefresh.post(`${APP_CONFIG.IDENTITY_HOST}/connect/token`, data)
};
