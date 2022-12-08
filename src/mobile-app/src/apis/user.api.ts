import {AxiosResponse} from 'axios';
import {APP_CONFIG} from './../constants/app.config';

import {createAxios, handleAxiosApi} from './../utils/axios.util';

import {ApiResponse} from '../types/ApiResponse.type';
import {User} from '../types/User/User.type';
import {UpdateProfileDTO} from '../dto/UserDTO.type';
import {ChangePasswordDTO} from './../dto/UserDTO.type';
import { PageOptions } from '../types/PageOptions.type';

const axiosInstance = createAxios(APP_CONFIG.MASTER_HOST);

const list = (
	textSearch: string, searchParams?: PageOptions,
	excludeMe?: boolean
): Promise<ApiResponse<User[]>> => {
	if (!searchParams) searchParams = new PageOptions();
  const responsePromise = axiosInstance.get(`/user/getlist`, {
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch,
			excludeMe
		},
	})
	return handleAxiosApi<ApiResponse<User[]>>(responsePromise);
};

const getMyProfile = (): Promise<AxiosResponse<ApiResponse<User>>> => {
  return axiosInstance.get(`/user/myProfile`);
};

const updateMyProfile = (
  data: UpdateProfileDTO,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.post(`/user/updateMyProfile`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const changeMyPassword = (
  data: ChangePasswordDTO,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.post(`/user/changeMyPassword`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getUser = (
  userId: string,
): Promise<ApiResponse<User>> => {
  return handleAxiosApi(axiosInstance.get(`/user/${userId}`));
};

const checkMe = (): Promise<ApiResponse<boolean>> => {
	return handleAxiosApi(axiosInstance.post(`/user/checkUser`));
};

const selfDelete  = (password: string): Promise<ApiResponse<undefined>> => {
	return handleAxiosApi(axiosInstance.post(`/user/SelfDelete`, {
    params: { password}
  }));
};

export const userApi = {
  list,
  getUser,
  checkMe,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  selfDelete
};
