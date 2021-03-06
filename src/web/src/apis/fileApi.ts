import API from "../config/apis";
import { ApiResult } from "../models/apis/ApiResult.model";
import { BaseFile } from "../models/file/File.model";
import { createAxios } from "../utils/axios";
import { handleAxiosApi } from "../utils/functions";

const comAxiosInstance = createAxios(API.FILE_SERVICE);
export const fileApi = {
    uploadFiles : async (files: File[], onUploadProgress: (progress:any)=>void, feature?:string)=>{
        var formData = new FormData();
        if(feature){
            formData.append("feature", feature);
        }

        for(const file of Array.from(files)){
            formData.append("files", file);
        }
        
        return await handleAxiosApi<ApiResult<BaseFile[]>>(comAxiosInstance.post('file', formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress : onUploadProgress
            }));
    }
}