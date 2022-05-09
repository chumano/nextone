import axios, { AxiosResponse } from 'axios';

const baseApi = process.env.REACT_APP_MAP_API;
const axiosInstance = axios.create({
  baseURL: `${baseApi}`
});

export const useSymbolApi = () => {
  const list = (): Promise<AxiosResponse<Symbol>> => {
    return axiosInstance.get(`/symbol`);
  };

  const create = (source: any): Promise<AxiosResponse<Symbol>> => {
    const formData = new FormData();
    Object.keys(source).forEach((key) => {
      if(source[key]!=undefined){
        formData.append(key, source[key]);
      }
      
    });
  
    return axiosInstance.post(`${baseApi}/symbol`, formData,  {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };


  const remove = (name: string): Promise<AxiosResponse<Symbol>> => {
    return axiosInstance.delete(`${baseApi}/symbol/${name}`);
  };

  return { list, create, remove };
};