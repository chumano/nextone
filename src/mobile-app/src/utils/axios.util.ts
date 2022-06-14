import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';

import {UserTokenInfoResponse} from '../types/Auth/Auth.type';

export const createAxios = (baseUrl: string) => {
  const newInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      Accept: 'application/json',
    },
    paramsSerializer: params => {
      return qs.stringify(params);
    },
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
    error => {
      return Promise.reject(error);
    },
  );

  return newInstance;
};
