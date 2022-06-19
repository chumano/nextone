import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import qs from 'qs';
import { AxiosResponse } from 'axios';
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


export async function handleAxiosApi<T>(
  axiosPromises: Promise<AxiosResponse<any>> | Promise<AxiosResponse<any>>[]
): Promise<T> {
  axiosPromises = Array.isArray(axiosPromises) ? axiosPromises : [axiosPromises];

  if (axiosPromises.length === 1) {
    const { data } = await axiosPromises[0];
    return data;
  }

  return Promise.all(
    axiosPromises.map(async (promise) => {
      const { data } = await promise;
      return data;
    })
  ) as any;
}