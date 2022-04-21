import axios, { AxiosResponse } from 'axios';
import { MapInfo } from '../interfaces';

const baseApi = process.env.REACT_APP_MAP_API;

export const useMapApi = () => {
  const list = (): Promise<AxiosResponse<MapInfo>> => {
    return axios.get(`${baseApi}/maps`);
  };

  const create = (map: MapInfo): Promise<AxiosResponse<MapInfo>> => {
    //return axios.post(`${baseApi}/maps`, map);
    return new Promise( (resolve)=>{
        resolve( {
            status: 200,
            data: map,
        } as AxiosResponse<MapInfo>);
    })
  };

  const update = (id: string, map: MapInfo): Promise<AxiosResponse<MapInfo>> => {
    return axios.put(`${baseApi}/maps/${id}`, map);
  };

  const remove = (id: string): Promise<AxiosResponse<MapInfo>> => {
    return axios.delete(`${baseApi}/maps/${id}`);
  };

  return { list, create, update, remove };
};