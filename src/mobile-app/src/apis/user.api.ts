import {AxiosResponse} from 'axios';
import {APP_CONFIG} from './../constants/app.config';

import {createAxios} from './../utils/axios.util';

import {ApiResponse} from '../types/ApiResponse.type';
import {User} from '../types/User/User.type';
import {UpdateProfileDTO} from '../dto/UserDTO.type';
import {ChangePasswordDTO} from './../dto/UserDTO.type';

const axiosInstance = createAxios(APP_CONFIG.MASTER_HOST);

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

export const userApi = {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
};
