import { APP_CONFIG } from "../constants/app.config";
import { ApiResponse } from "../types/ApiResponse.type";
import { BaseFile } from "../types/File/BaseFile.type";
import { createAxios, handleAxiosApi } from "../utils/axios.util";

const comAxiosInstance = createAxios(APP_CONFIG.FILE_HOST);

export const fileApi = {
    uploadFiles: async (files:  {
        uri: string;
        name: string;
        type: string;
      }[], onUploadProgress: (progress: any) => void, feature?: string) => {
        var formData = new FormData();
        if (feature) {
            formData.append("feature", feature);
        }

        for (const file of Array.from(files)) {
            formData.append("files", file);
        }

        return await handleAxiosApi<ApiResponse<BaseFile[]>>(comAxiosInstance.post('file', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: onUploadProgress
            }));
    }
}