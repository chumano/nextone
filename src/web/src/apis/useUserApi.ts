import {
	ActivateUserRequest,
	CreateUserResponse,
	ResetPasswordUserRequest,
	UpdateUserRequest,
	UpdateUserRoleRequest,
} from "./../models/user/User.model";
import { ApiResult } from "./../models/apis/ApiResult.model";
import { AxiosResponse } from "axios";

import BaseAPI from "../config/apis";

import { mapAxiosInstance } from "../config/axios";
import { PageOptions } from "../models/apis/PageOptions.model";
import { CreateUserRequest, User } from "../models/user/User.model";

const baseApi = BaseAPI.MASTER_SERVICE;
const axiosInstance = mapAxiosInstance;

export const useUserApi = () => {
	const list = (
		textSearch: string, searchParams?: PageOptions
	): Promise<AxiosResponse<ApiResult<User[]>>> => {
		if (!searchParams) searchParams = new PageOptions();
		return axiosInstance.get(`${baseApi}/user/getlist`, {
			params: {
				offset: searchParams.offset,
				pageSize: searchParams.pageSize,
				textSearch
			},
		});
	};

	const count = (textSearch?: string): Promise<AxiosResponse<ApiResult<number>>> => {
		return axiosInstance.get(`${baseApi}/user/count`, {
			params: textSearch
		})
	}

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

	const updateUserRole = (
		userNeedToUpdateRole: UpdateUserRoleRequest
	): Promise<AxiosResponse<ApiResult<null>>> => {
		return axiosInstance.post(`${baseApi}/user/updateUserRoles`, userNeedToUpdateRole);
	}

	const deleteUser = (
		userId: string
	): Promise<AxiosResponse<ApiResult<null>>> => {
		return axiosInstance.delete(`${baseApi}/user/${userId}`);
	};

	const activateUser = (
		userNeedToActivate: ActivateUserRequest
	): Promise<AxiosResponse<ApiResult<null>>> => {
		return axiosInstance.post(`${baseApi}/user/activeUser`, userNeedToActivate);
	};

	const resetPassword = (
		userNeedToResetPassword: ResetPasswordUserRequest
	): Promise<AxiosResponse<ApiResult<string>>> => {
		return axiosInstance.post(
			`${baseApi}/user/resetPassword`,
			userNeedToResetPassword
		);
	};
	return {
		list,
		count,
		getUser,
		createUser,
		updateUser,
		updateUserRole,
		deleteUser,
		activateUser,
		resetPassword,
	};
};
