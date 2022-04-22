import axios, { AxiosResponse } from 'axios';
import { LayerSource, MapInfo } from '../interfaces';
import mockDataSourceApi from './mock/MockDataSourceApi';
import mockMapApi from './mock/MockMapApi';

const baseApi = process.env.REACT_APP_MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`
});

mockDataSourceApi(axiosInstance);

export const useDatasourceApi = () => {
  const list = (): Promise<AxiosResponse<LayerSource>> => {
    return axiosInstance.get(`/datasources`);
  };

  const create = (source: LayerSource): Promise<AxiosResponse<LayerSource>> => {
    return axiosInstance.post(`${baseApi}/datasources`, source);
  };

  const update = (id: string, source: LayerSource): Promise<AxiosResponse<LayerSource>> => {
    return axiosInstance.put(`${baseApi}/datasources/${id}`, source);
  };

  const remove = (id: string): Promise<AxiosResponse<LayerSource>> => {
    return axiosInstance.delete(`${baseApi}/datasources/${id}`);
  };

  return { list, create, update, remove };
};