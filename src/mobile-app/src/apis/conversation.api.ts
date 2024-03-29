import {
  GetMessagesHistoryDTO,
  SendMessageDTO,
} from './../dto/ConversationDTO.type';
import {AxiosResponse} from 'axios';
import {APP_CONFIG} from './../constants/app.config';
import {createAxios, handleAxiosApi} from './../utils/axios.util';

import {GetListConversationDTO} from '../dto/ConversationDTO.type';
import {Conversation} from './../types/Conversation/Conversation.type';
import {ApiResponse} from './../types/ApiResponse.type';
import {Message} from '../types/Message/Message.type';
import { CreateConverationDTO } from '../dto/CreateConverationDTO';
import { UserStatus } from '../types/User/UserStatus.type';
import { AppSettings } from '../types/AppSettings';
import { UpdateUserStatusDTO } from '../dto/UserStatusDTO';
import { IApplicationSettings } from '../types/AppConfig.type';

const axiosInstance = createAxios(APP_CONFIG.COM_HOST);


const getOrCreateConversation = async (data: CreateConverationDTO)=>{
  const responsePromise = axiosInstance.post('/conversation/CreateConversation', data)
  return await handleAxiosApi<ApiResponse<string>>(responsePromise);
};

const getListConversation = (
  data?: GetListConversationDTO,
): Promise<AxiosResponse<ApiResponse<Conversation[]>>> => {
  //console.log('[api] getListConversation', data)
  return axiosInstance.get(`/conversation/getList`, {
    params: data,
  });
};

const getConversation = (
  conversationId: string,
): Promise<ApiResponse<Conversation>> => {
  return handleAxiosApi(axiosInstance.get(`/conversation/${conversationId}`));
};

const sendMessage = (
  data: SendMessageDTO,
): Promise<AxiosResponse<ApiResponse<Message>>> => {
  return axiosInstance.post(`/conversation/sendMessage`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const userSeenCoversation = async (id:string)=>{
  const responsePromise = axiosInstance.post(`/conversation/${id}/Seen`);
  return await handleAxiosApi<ApiResponse<undefined>>(responsePromise);
}


const deleteMessage = async(conversationId: string, messageId:string)=>{
  const responsePromise = axiosInstance.delete(`/conversation/${conversationId}/Message/${messageId}`);
  return await handleAxiosApi<ApiResponse<undefined>>(responsePromise);
};

const getMessagesHistory = (
  data: GetMessagesHistoryDTO,
): Promise<AxiosResponse<ApiResponse<Message[]>>> => {
  return axiosInstance.get(`/conversation/getMessagesHistory`, {params: data});
};

const getOnlineUsersForMap = async (data?: any)=>{
  const responsePromise = axiosInstance.get('/userstatus/GetOnlineUsersForMap', {params: data});
  return await handleAxiosApi<ApiResponse<UserStatus[]>>(responsePromise);
};

const updateMyStatus = (
  data: UpdateUserStatusDTO,
): Promise<AxiosResponse<ApiResponse<undefined>>> => {
  return axiosInstance.post(`/userstatus/UpdateUserLocation`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

//settings
const getSettings= async ()=>{
  const responsePromise = axiosInstance.get('/settings')
  return await handleAxiosApi<ApiResponse<AppSettings[]>>(responsePromise);
};

const getAppSettings = async ()=>{
  const responsePromise = axiosInstance.get('/settings/Application')
  return await handleAxiosApi<ApiResponse<IApplicationSettings>>(responsePromise);
}

export const conversationApi = {
  getAppSettings,
  getOrCreateConversation,
  getListConversation,
  getConversation,
  sendMessage,
  userSeenCoversation,
  deleteMessage,
  getMessagesHistory,
  getOnlineUsersForMap,
  getSettings,
  updateMyStatus
};
