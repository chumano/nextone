import {SendEventDTO, GetEventsByMeDTO} from './../dto/EventDTO.type';

import {AxiosResponse} from 'axios';
import {APP_CONFIG} from './../constants/app.config';
import {createAxios, handleAxiosApi} from './../utils/axios.util';

import {ApiResponse} from './../types/ApiResponse.type';
import {Event} from '../types/Event/Event.type';
import { EventInfo } from '../types/Event/EventInfo.type';

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

const getEventsForMap = async (data : { eventTypeCodes : string[]})=>{
  const responsePromise = axiosInstance.get('/event/GetEventsForMap', {params: data})
  return await handleAxiosApi<ApiResponse<EventInfo[]>>(responsePromise);
};

export const eventApi = {
  sendEvent,
  getEventsByMe,
  getEventsForMap
};
