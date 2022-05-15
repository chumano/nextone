import { ApiResult } from "./../models/apis/ApiResult.model";
import { AxiosResponse } from "axios";

import BaseAPI from "../config/apis";

import { mapAxiosInstance } from "../config/axios";
import { PageOptions } from "../models/apis/PageOptions.model";
import { User } from "../models/user/User.model";

const baseApi = BaseAPI.MASTER_SERVICE;
const axiosInstance = mapAxiosInstance;

export const useUserApi = () => {
	const list = (
		searchParams?: PageOptions
	): Promise<AxiosResponse<ApiResult<User[]>>> => {
		if (!searchParams) searchParams = new PageOptions();
		return axiosInstance.get(`${baseApi}/user/getlist`, {
			params: searchParams,
		});
	};

	const get = (userId: string): Promise<AxiosResponse<ApiResult<User>>> => {
		return axiosInstance.get(`${baseApi}/user/${userId}`);
	};

	return {
		list,
		get,
	};
};
