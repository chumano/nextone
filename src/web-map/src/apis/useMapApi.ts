import axios, { AxiosResponse } from 'axios';
import { MapInfo } from '../interfaces';
import { CreateMapDTO } from '../interfaces/dtos';
import mockMapApi from './mock/MockMapApi';

const baseApi = process.env.REACT_APP_MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`
});

// /mockMapApi(axiosInstance);

export const useMapApi = () => {
  const list = (): Promise<AxiosResponse<MapInfo[]>> => {
    return axiosInstance.get(`/maps`);
  };

  const get = (id: string): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.get(`/maps/${id}`);
  };

  const create = (map: CreateMapDTO): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.post(`${baseApi}/maps/create`, map);
  };

  const update = (id: string, map: MapInfo): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.post(`${baseApi}/maps/update/${id}`, map);
  };

  const remove = (id: string): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.delete(`${baseApi}/maps/${id}`);
  };

  return { list, get, create, update, remove };
};