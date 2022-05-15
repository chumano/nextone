import {
	CreateUserResponse,
	UpdateUserRequest,
} from "./../models/user/User.model";
import { ApiResult } from "./../models/apis/ApiResult.model";
import { Axios, AxiosResponse } from "axios";

import BaseAPI from "../config/apis";

import { mapAxiosInstance } from "../config/axios";
import { PageOptions } from "../models/apis/PageOptions.model";
import { CreateUserRequest, User } from "../models/user/User.model";

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

	const getUser = (userId: string): Promise<AxiosResponse<ApiResult<User>>> => {
		return axiosInstance.get(`${baseApi}/user/${userId}`);
	};

	const createUser = (
		newUser: CreateUserRequest
	): Promise<AxiosResponse<ApiResult<CreateUserResponse>>> => {
		return axiosInstance.post(`${baseApi}/user/createUser`, newUser);
	};

	const updateUser = (
		userNeedToUpdate: UpdateUserRequest
	): Promise<AxiosResponse<ApiResult<null>>> => {
		return axiosInstance.post(`${baseApi}/user/updateUser`, userNeedToUpdate);
	};

	const deleteUser = (
		userId: string
	): Promise<AxiosResponse<ApiResult<null>>> => {
		return axiosInstance.delete(`${baseApi}/user/${userId}`);
	};

	return {
		list,
		getUser,
		createUser,
		updateUser,
		deleteUser,
	};
};
