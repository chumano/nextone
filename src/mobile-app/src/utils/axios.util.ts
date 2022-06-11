import axios from 'axios';
import qs from 'qs';

export const createAxios = (baseUrl: string) => {
  const newInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: '',
      'Content-Type': 'application/json',
    },
    paramsSerializer: params => {
      return qs.stringify(params);
    },
  });

  newInstance.interceptors.request.use(
    request => {
      if (
        request.data &&
        request.headers[request.method!]['Content-Type'] ===
          'application/x-www-form-urlencoded'
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
