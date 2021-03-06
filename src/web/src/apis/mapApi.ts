import axios, { AxiosRequestConfig } from "axios";
import API from "../config/apis";
import { MapInfo } from "../models/map/Map.modal";
import { AuthenticationService } from "../services";

const axiosInstance = axios.create({
    baseURL : API.MAP_SERVICE
});

const axiosRequestConfig = async (config: AxiosRequestConfig<any>) => {
    // Do something before request is sent
    const authenticated = await AuthenticationService.isAuthenticated();
    if (authenticated) {
        const access_token = await AuthenticationService.getAccessToken();
        config.headers = {
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json',
            //'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    return config;
}

axiosInstance.interceptors.request.use(
    axiosRequestConfig,
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

export const mapApi = {
    getMaps : async () =>{
        const response = await axiosInstance.get<MapInfo[]>('maps/tileUrl')
        console.log('maps/tileUrl', response);
        return response.data
    }
}