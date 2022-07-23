import {APP_CONFIG} from './../constants/app.config';

import {createAxios, handleAxiosApi} from './../utils/axios.util';

import {ApiResponse} from '../types/ApiResponse.type';

import {PageOptions} from '../types/PageOptions.type';
import {GetListNewsDTO} from '../dto/NewsDTO.type';
import {News} from '../types/News/News.type';

const axiosInstance = createAxios(APP_CONFIG.COM_HOST);

const list = (
  textSearch: string,
  getListNewsDTO: GetListNewsDTO,
): Promise<ApiResponse<News[]>> => {
  if (!getListNewsDTO.pageSize) {
    const pageOptions = new PageOptions();
    getListNewsDTO = {
      ...getListNewsDTO,
      pageSize: pageOptions.pageSize,
      offset: pageOptions.offset,
    };
  }
  const responsePromise = axiosInstance.get(`/news/getlist`, {
    params: {
      textSearch,
      ...getListNewsDTO,
    },
  });
  return handleAxiosApi<ApiResponse<News[]>>(responsePromise);
};

export const newsApi = {
  list,
};
