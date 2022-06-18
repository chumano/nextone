import {SendEventDTO, GetEventsByMeDTO} from './../dto/EventDTO.type';

import {AxiosResponse} from 'axios';
import {APP_CONFIG} from './../constants/app.config';
import {createAxios} from './../utils/axios.util';

import {ApiResponse} from './../types/ApiResponse.type';
import {Event} from '../types/Event/Event.type';

const axiosInstance = createAxios(APP_CONFIG.COM_HOST);

const sendEvent = (
  data: SendEventDTO,
): Promise<AxiosResponse<ApiResponse<null>>> => {
  return axiosInstance.post(`/event/sendEvent`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getEventsByMe = (
  data: GetEventsByMeDTO,
): Promise<ApiResponse<ApiResponse<Event[]>>> => {
  return axiosInstance.get(`/event/getEventsByMe`, {params: data});
};

export const eventApi = {
  sendEvent,
  getEventsByMe,
};
