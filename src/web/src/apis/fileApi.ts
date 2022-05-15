import { ApiResult } from "../models/apis/ApiResult.model";
import { BaseFile } from "../models/file/File.model";
import { createAxios } from "../utils/axios";
import { handleAxiosApi } from "../utils/functions";

const FILE_URL ='http://localhost:5106';
const comAxiosInstance = createAxios(FILE_URL);
export const fileApi = {
    uploadFiles : async (files: FileList, feature?:string)=>{
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
                onUploadProgress : (progressEvent) => {
                    console.log('upload_file',progressEvent.loaded)
                }
            }));
    }
}