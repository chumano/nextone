import {SendMessageDTO} from './../dto/ConversationDTO.type';
import {AxiosResponse} from 'axios';
import {APP_CONFIG} from './../constants/app.config';
import {createAxios} from './../utils/axios.util';

import {GetListConversationDTO} from '../dto/ConversationDTO.type';
import {Conversation} from './../types/Conversation/Conversation.type';
import {ApiResponse} from './../types/ApiResponse.type';
import {Message} from '../types/Message/Message.type';

const axiosInstance = createAxios(APP_CONFIG.COM_HOST);

const getListConversation = (
  data?: GetListConversationDTO,
): Promise<AxiosResponse<ApiResponse<Conversation[]>>> => {
  return axiosInstance.get(`/conversation/getList`, {
    params: data,
  });
};

const getConversation = (
  conversationId: string,
): Promise<AxiosResponse<ApiResponse<Conversation>>> => {
  return axiosInstance.get(`/conversation/${conversationId}`);
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

export const conversationApi = {
  getListConversation,
  getConversation,
  sendMessage,
};
