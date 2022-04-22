import axios, { AxiosResponse } from 'axios';
import { MapInfo } from '../interfaces';
import mockMapApi from './mock/MockMapApi';

const baseApi = process.env.REACT_APP_MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`
});

mockMapApi(axiosInstance);

export const useMapApi = () => {
  const list = (): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.get(`/maps`);
  };

  const create = (map: MapInfo): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.post(`${baseApi}/maps`, map);
  };

  const update = (id: string, map: MapInfo): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.put(`${baseApi}/maps/${id}`, map);
  };

  const remove = (id: string): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.delete(`${baseApi}/maps/${id}`);
  };

  return { list, create, update, remove };
};