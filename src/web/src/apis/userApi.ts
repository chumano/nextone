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
import { handleAxiosApi } from "../utils/functions";
import { UserActivity } from "../pages/admin/user-activity/userActivityContext";
import { Backup, BackupSchedule } from "../pages/admin/backup/backupContext";

const axiosInstance = createAxios(API.MASTER_SERVICE);
const list = (
	textSearch: string, searchParams?: PageOptions,
	excludeMe?: boolean,
	orderBy?: string
): Promise<AxiosResponse<ApiResult<User[]>>> => {
	if (!searchParams) searchParams = new PageOptions();
	return axiosInstance.get(`/user/getlist`, {
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch,
			excludeMe,
			orderBy
		},
	});
};


const getMyProfile = (): Promise<ApiResult<User>> => {
	return handleAxiosApi(axiosInstance.get(`/user/myprofile`));
};
const updateMyProfile = (profile: { name: string, phone: string }): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.post(`/user/updatemyprofile`, profile));
};

const changeMyPassword = (data: { oldPassword: string, newPassword: string }): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.post(`/user/changemypassword`, data));
};

const count = (textSearch?: string,excludeMe?: boolean): Promise<AxiosResponse<ApiResult<number>>> => {
	return axiosInstance.get(`/user/count`, {
		params: {
			textSearch,
			excludeMe
		}
	})
}
const checkMe = (): Promise<ApiResult<boolean>> => {
	return handleAxiosApi(axiosInstance.post(`/user/checkUser`));
};
const getUser = (userId: string): Promise<ApiResult<User>> => {
	return handleAxiosApi(axiosInstance.get(`/user/${userId}`));
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

const getUserActivities = (
	textSearch: string, searchParams?: PageOptions,
	
): Promise<ApiResult<UserActivity[]>> => {
	if (!searchParams) searchParams = new PageOptions();
	return handleAxiosApi(axiosInstance.get(`/user/GetActivities`, {
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch
		},
	}));
};

const countUserActivities = (
	textSearch: string
	
): Promise<ApiResult<number>> => {
	return handleAxiosApi(axiosInstance.get(`/user/CountActivities`, {
		params: {
			textSearch
		},
	}));
};

const deleteUserActivity = (
	activityId: string
): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.delete(`/user/activity/${activityId}`));
};

//system
const getBackups = (
): Promise<ApiResult<Backup[]>> => {
	return handleAxiosApi(axiosInstance.get(`/system/GetBackups`, {
		params: { },
	}));
};

const createBackup = () : Promise<ApiResult<undefined>>=>{
	return handleAxiosApi(axiosInstance.post(`/system/Backup`));
}

const getBackupSchedule = (	): Promise<ApiResult<BackupSchedule>> => {
	return handleAxiosApi(axiosInstance.get(`/system/GetBackupSchedule`));
};
	
const updateBackupSchedule = (backupIntervalInDays: number, keepNumber:number): Promise<ApiResult<undefined>> =>{
	return handleAxiosApi(axiosInstance.post(`/system/UpdateBackupSchedule`,{
		backupIntervalInDays,
		keepNumber
	}));
}

export const userApi = {
	checkMe,
	getMyProfile,
	updateMyProfile,
	changeMyPassword,

	list,
	count,
	getUser,
	createUser,
	updateUser,
	updateUserRole,
	deleteUser,
	activateUser,
	resetPassword,

	getUserActivities,
	countUserActivities,
	deleteUserActivity,

	getBackups,
	createBackup,
	getBackupSchedule,
	updateBackupSchedule
};
