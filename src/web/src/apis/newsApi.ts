
import { AxiosResponse } from "axios";
import API from "../config/apis";
import { ApiResult } from "../models/apis/ApiResult.model";
import { PageOptions } from "../models/apis/PageOptions.model";
import { CreateNewsDTO, UpdateNewsDTO } from "../models/dtos/NewsDTOs";
import { News } from "../models/news/News";
import { createAxios } from "../utils";
import { handleAxiosApi } from "../utils/functions";

const axiosInstance = createAxios(API.COM_SERVICE);
const list = (
	textSearch: string, searchParams?: PageOptions,
	excludeMe?: boolean 
): Promise<AxiosResponse<ApiResult<News[]>>> => {
	if (!searchParams) searchParams = new PageOptions();
	return handleAxiosApi(axiosInstance.get(`/news/getlist`, {
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch,
			excludeMe
		},
	}));
};

const count = (textSearch?: string): Promise<AxiosResponse<ApiResult<number>>> => {
	return handleAxiosApi(axiosInstance.get(`/news/count`, {
		params: textSearch
	}))
}

const getNews = (userId: string): Promise<AxiosResponse<ApiResult<News>>> => {
	return handleAxiosApi(axiosInstance.get(`/news/${userId}`));
};

const createNews = (
	data: CreateNewsDTO
): Promise<AxiosResponse<ApiResult<string>>> => {
	return handleAxiosApi(axiosInstance.post(`/news/createUser`, data));
};

const updateNews = (
    id: string,
	data: UpdateNewsDTO
): Promise<AxiosResponse<ApiResult<null>>> => {
	return handleAxiosApi(axiosInstance.post(`/news/update/${id}`, data));
};

const deleteNews = (
	id: string
): Promise<AxiosResponse<ApiResult<null>>> => {
	return handleAxiosApi(axiosInstance.delete(`/user/${id}`));
};

const publishNews = (
	id: string
): Promise<AxiosResponse<ApiResult<null>>> => {
	return handleAxiosApi(axiosInstance.post(`/news/update/${id}`));
};


const unpublishNews = (
	id: string
): Promise<AxiosResponse<ApiResult<null>>> => {
	return handleAxiosApi(axiosInstance.post(`/news/unpublish/${id}`));
};

export const userApi = {
	list,
	count,
	getNews,
	createNews,
	updateNews,
	deleteNews,
    publishNews,
    unpublishNews
};
