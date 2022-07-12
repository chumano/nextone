import { Platform } from "react-native";
import { APP_CONFIG } from "../constants/app.config";
import { ApiResponse } from "../types/ApiResponse.type";
import { BaseFile } from "../types/File/BaseFile.type";
import { createAxios, handleAxiosApi } from "../utils/axios.util";

const axiosInstance = createAxios(APP_CONFIG.COM_HOST);

export const notificationApi = {
    registerToken: async (token:string, oldToken?: string) => {
        const data = {
            token,
            oldToken,
            os:  Platform.OS+"_"+ Platform.Version
        }
        return await handleAxiosApi<ApiResponse<undefined>>(axiosInstance.post('/notification/RegisterToken', data));
    },

    removeToken : async (token:string)=>{
        const data = {
            token
        }
        return await handleAxiosApi<ApiResponse<undefined>>(axiosInstance.post('/notification/RemoveToken', data));
    }
}