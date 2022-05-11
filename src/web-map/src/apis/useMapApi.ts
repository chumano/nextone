import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { MAP_API } from '../config/AppWindow';
import { MapInfo } from '../interfaces';
import { CreateMapDTO, SearchMapDTO, UpdateMapLayersDTO, UpdateMapNameDTO } from '../interfaces/dtos';
import mockMapApi from './mock/MockMapApi';

const baseApi = MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`,
  paramsSerializer: params => {
    return qs.stringify(params)
  }
});

// /mockMapApi(axiosInstance);

export const useMapApi = () => {
  const list = (searchParams?: SearchMapDTO): Promise<AxiosResponse<MapInfo[]>> => {
    return axiosInstance.get(`/maps`,{
      params: searchParams
     });
  };

  const get = (id: string): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.get(`/maps/${id}`);
  };

  const create = (map: CreateMapDTO): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.post(`${baseApi}/maps/create`, map);
  };

  const update = (id: string, map: UpdateMapLayersDTO): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.post(`${baseApi}/maps/update/${id}`, map);
  };

  const updateName = (id: string, map: UpdateMapNameDTO): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.post(`${baseApi}/maps/updateName/${id}`, map);
  };

  const remove = (id: string): Promise<AxiosResponse<MapInfo>> => {
    return axiosInstance.delete(`${baseApi}/maps/${id}`);
  };

  return { list, 
    get, 
    create, 
    update, 
    updateName,
    remove };
};