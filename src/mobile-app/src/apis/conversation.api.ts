import {AxiosResponse} from 'axios';
import {APP_CONFIG, OAUTH_CONFIG} from './../constants/app.config';

import {UserTokenInfoResponse} from '../types/Auth/Auth.type';

import {createAxios} from './../utils/axios.util';

const axiosInstance = createAxios(APP_CONFIG.COM_HOST);

const getConversationList = (): Promise<
  AxiosResponse<UserTokenInfoResponse>
> => {
  return axiosInstance.get(`/conversation/GetList`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const conversationApi = {
  getConversationList,
};
