
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
	textSearch?: string,
	publishState?: 0 | 1 | 2,
	searchParams?: PageOptions
): Promise<ApiResult<News[]>> => {
	if (!searchParams) searchParams = new PageOptions();
	return handleAxiosApi(axiosInstance.get(`/news/getlist`, {
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch,
			publishState
		},
	}));
};

const count = (textSearch?: string, publishState?: 0 | 1 | 2): Promise<ApiResult<number>> => {
	return handleAxiosApi(axiosInstance.get(`/news/count`, {
		params: {
			textSearch,
			publishState
		}
	}))
}

const publiclist = (
	textSearch?: string,
	publishState?: 0 | 1 | 2,
	searchParams?: PageOptions
): Promise<ApiResult<News[]>> => {
	if (!searchParams) searchParams = new PageOptions();
	return handleAxiosApi(axiosInstance.get(`/news/getlist`, {
		transformRequest: (data, headers) => {
			if (headers) {
				delete headers['Authorization'];
			}
			return data;
		},
		params: {
			offset: searchParams.offset,
			pageSize: searchParams.pageSize,
			textSearch,
			publishState
		},
	}));
};

const publiccount = (textSearch?: string, publishState?: 0 | 1 | 2): Promise<ApiResult<number>> => {
	return handleAxiosApi(axiosInstance.get(`/news/count`, {
		transformRequest: (data, headers) => {
			if (headers) {
				delete headers['Authorization'];
			}
			return data;
		},
		params: {
			textSearch,
			publishState
		}
	}))
}

const getNews = (userId: string): Promise<ApiResult<News>> => {
	return handleAxiosApi(axiosInstance.get(`/news/${userId}`));
};

const createNews = (
	data: CreateNewsDTO
): Promise<ApiResult<string>> => {
	return handleAxiosApi(axiosInstance.post(`/news/createNews`, data));
};

const updateNews = (
	id: string,
	data: UpdateNewsDTO
): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.post(`/news/update/${id}`, data));
};

const deleteNews = (
	id: string
): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.delete(`/news/${id}`));
};

const publishNews = (
	id: string
): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.post(`/news/publish/${id}`));
};


const unpublishNews = (
	id: string
): Promise<ApiResult<null>> => {
	return handleAxiosApi(axiosInstance.post(`/news/unpublish/${id}`));
};

export const newsApi = {
	list,
	count,
	getNews,
	createNews,
	updateNews,
	deleteNews,
	publishNews,
	unpublishNews,
	publiclist,
	publiccount
};
