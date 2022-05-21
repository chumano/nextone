import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

import AuthenticationService from "../services/AuthenticationService";

import BaseAPI from "../config/apis";

const axiosRequestConfig = async (config: AxiosRequestConfig<any>) => {
	// Do something before request is sent
	const authenticated = await AuthenticationService.isAuthenticated();
	if (authenticated) {
		const access_token = await AuthenticationService.getAccessToken();
		config.headers = {
			//Authorization: `Bearer ${access_token}`,
			//Accept: "application/json",
			//'Content-Type': 'application/x-www-form-urlencoded'
		};
	}

	return config;
};

export const axiosSetup = () => {
	// Add a request interceptor
	const myInterceptor = axios.interceptors.request.use(
		axiosRequestConfig,
		(error) => {
			// Do something with request error
			return Promise.reject(error);
		}
	);
	//axios.interceptors.request.eject(myInterceptor);

	// Add a response interceptor
	axios.interceptors.response.use(
		function (response) {
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			return response;
		},
		async (error) => {
			const originalRequest = error.config;
			if (error.response.status === 403 && !originalRequest._retry) {
				originalRequest._retry = true;
				// const access_token = await refreshAccessToken();
				// axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
				// /return axios(originalRequest);
			}
			return Promise.reject(error);
		}
	);
};

export const createAxios = (baseURL: string) => {
	const newInstance = axios.create({
		baseURL,
		paramsSerializer: (params) => {
			return qs.stringify(params);
		},
	});

	newInstance.interceptors.request.use(axiosRequestConfig, (error) => {
		// Do something with request error
		return Promise.reject(error);
	});
	return newInstance;
};

export const mapAxiosInstance = createAxios(BaseAPI.COM_SERVICE);
