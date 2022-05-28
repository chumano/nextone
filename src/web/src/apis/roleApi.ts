import { AxiosResponse } from "axios";
import API from "../config/apis";
import { ApiResult } from "../models/apis/ApiResult.model";
import { Role } from "../models/role/Role.model";
import { createAxios } from "../utils";

const axiosInstance = createAxios(API.MASTER_SERVICE);
const list = (): Promise<AxiosResponse<ApiResult<Role[]>>> => {
	return axiosInstance.get(`/role/getlist`);
};

export const roleApi = {
	list,
};
