import {
	ActivateUserRequest,
	CreateUserResponse,
	ResetPasswordUserRequest,
	UpdateUserRequest,
	UpdateUserRoleRequest,
} from "../models/user/User.model";
import { ApiResult } from "../models/apis/ApiResult.model";
import { AxiosResponse } from "axios";

import { PageOptions } from "../models/apis/PageOptions.model";
import { CreateUserRequest, User } from "../models/user/User.model";
import { createAxios } from "../utils";
import API from "../config/apis";

const axiosInstance = createAxios(API.MASTER_SERVICE);
const list = (
	textSearch: string, searchParams?: PageOptions,
	excludeMe?: boolean 
): Promise<AxiosResponse<ApiResult<User[]>>> => {
	if (!searchParams) searchParams = new PageOptions();
	return axiosInstance.get(`/user/getlist`, {
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch,
			excludeMe
		},
	});
};

const count = (textSearch?: string): Promise<AxiosResponse<ApiResult<number>>> => {
	return axiosInstance.get(`/user/count`, {
		params: textSearch
	})
}

const getUser = (userId: string): Promise<AxiosResponse<ApiResult<User>>> => {
	return axiosInstance.get(`/user/${userId}`);
};

const createUser = (
	newUser: CreateUserRequest
): Promise<AxiosResponse<ApiResult<CreateUserResponse>>> => {
	return axiosInstance.post(`/user/createUser`, newUser);
};

const updateUser = (
	userNeedToUpdate: UpdateUserRequest
): Promise<AxiosResponse<ApiResult<null>>> => {
	return axiosInstance.post(`/user/updateUser`, userNeedToUpdate);
};

const updateUserRole = (
	userNeedToUpdateRole: UpdateUserRoleRequest
): Promise<AxiosResponse<ApiResult<null>>> => {
	return axiosInstance.post(`/user/updateUserRoles`, userNeedToUpdateRole);
}

const deleteUser = (
	userId: string
): Promise<AxiosResponse<ApiResult<null>>> => {
	return axiosInstance.delete(`/user/${userId}`);
};

const activateUser = (
	userNeedToActivate: ActivateUserRequest
): Promise<AxiosResponse<ApiResult<null>>> => {
	return axiosInstance.post(`/user/activeUser`, userNeedToActivate);
};

const resetPassword = (
	userNeedToResetPassword: ResetPasswordUserRequest
): Promise<AxiosResponse<ApiResult<string>>> => {
	return axiosInstance.post(
		`/user/resetPassword`,
		userNeedToResetPassword
	);
};


export const userApi = {
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
