import { AxiosResponse } from "axios";
import BaseAPI from "../config/apis";
import { mapAxiosInstance } from "../config/axios";
import { ApiResult } from "../models/apis/ApiResult.model";
import { Role } from "../models/role/Role.model";

const baseApi = BaseAPI.MASTER_SERVICE;
const axiosInstance = mapAxiosInstance;

export const useRoleApi = () => {
	const list = (): Promise<AxiosResponse<ApiResult<Role[]>>> => {
		return axiosInstance.get(`${baseApi}/role/getlist`);
	};

	return {
		list,
	};
};
