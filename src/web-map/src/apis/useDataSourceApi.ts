import axios, { AxiosResponse } from 'axios';
import {  DataSource, MapInfo } from '../interfaces';
import { UpdateDataSourceDTO } from '../interfaces/dtos';
import mockDataSourceApi from './mock/MockDataSourceApi';

const baseApi = process.env.REACT_APP_MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`
});

//mockDataSourceApi(axiosInstance);

export const useDatasourceApi = () => {
  const list = (): Promise<AxiosResponse<DataSource>> => {
    return axiosInstance.get(`/datasources`);
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

  return { list, create, update, remove };
};