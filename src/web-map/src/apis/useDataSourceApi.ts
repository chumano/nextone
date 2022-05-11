import axios, { AxiosResponse } from 'axios';
import { MAP_API } from '../config/AppWindow';
import {  DataSource, MapInfo } from '../interfaces';
import { SearchDataSourceDTO, UpdateDataSourceDTO } from '../interfaces/dtos';
import mockDataSourceApi from './mock/MockDataSourceApi';
import qs from 'qs';
const baseApi = MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`,
  paramsSerializer: params => {
    return qs.stringify(params)
  }
});

//mockDataSourceApi(axiosInstance);

export const useDatasourceApi = () => {
  const count = (searchParams?: SearchDataSourceDTO): Promise<AxiosResponse<number>> => {
    return axiosInstance.get(`/datasources/count`,{
       params: searchParams
      });
  };

  const list = (searchParams?: SearchDataSourceDTO): Promise<AxiosResponse<DataSource[]>> => {
    return axiosInstance.get(`/datasources`,{
       params: searchParams
      });
  };

  const get = (id:string): Promise<AxiosResponse<DataSource>> => {
    return axiosInstance.get(`/datasources/${id}`);
  };

  const create = (source: any): Promise<AxiosResponse<DataSource>> => {
    const formData = new FormData();
    Object.keys(source).forEach((key) => {
      if(source[key]!=undefined){
        formData.append(key, source[key]);
      }
      
    });
  
    return axiosInstance.post(`${baseApi}/datasources/create`, formData,  {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };

  const update = (id: string, source: UpdateDataSourceDTO): Promise<AxiosResponse<DataSource>> => {
    return axiosInstance.post(`${baseApi}/datasources/update/${id}`, source);
  };

  const remove = (id: string): Promise<AxiosResponse<DataSource>> => {
    return axiosInstance.delete(`${baseApi}/datasources/${id}`);
  };

  return { count, get, list, create, update, remove };
};