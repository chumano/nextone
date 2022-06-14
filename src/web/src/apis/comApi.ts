import axios from "axios";
import API from "../config/apis";
import { ApiResult } from "../models/apis/ApiResult.model";
import { AppSettings } from "../models/AppSettings";
import { Channel } from "../models/channel/Channel.model";
import { Conversation } from "../models/conversation/Conversation.model";
import { ConversationMember } from "../models/conversation/ConversationMember.model";
import { AddMembersDTO, CreateChannelDTO, CreateConverationDTO , GetEventsHistoryDTO, GetListChannelDTO, GetListConversationDTO, GetMessagesHistoryDTO, RemoveMemberDTO, SendEventDTO, SendMessageDTO, UpdateEventTypesChannelDTO, UpdateMemberRoleDTO} from "../models/dtos";
import { CreateEventTypeDTO, UpdateEventTypeDTO } from "../models/dtos/EventTypeDTO";
import { GetListUserStatusDTO } from "../models/dtos/UserStatusDTOs";
import { EventInfo } from "../models/event/Event.model";
import { EventType } from "../models/event/EventType.model";
import { Message } from "../models/message/Message.model";
import { UserStatus } from "../models/user/UserStatus.model";
import { createAxios } from "../utils";
import { handleAxiosApi } from "../utils/functions";

const comAxiosInstance = createAxios(API.COM_SERVICE);
export const comApi = {
    //conversation
    getOrCreateConversation : async (data: CreateConverationDTO)=>{
        const responsePromise = comAxiosInstance.post('/conversation/CreateConversation', data)
        return await handleAxiosApi<ApiResult<string>>(responsePromise);
    },

    getConversations : async (data?: GetListConversationDTO)=>{
        const responsePromise = comAxiosInstance.get('/conversation/GetList', {params: data})
        return await handleAxiosApi<ApiResult<Conversation[]>>(responsePromise);
    },

    //conversation or channel
    getConversation : async (id: string)=>{
        const responsePromise = comAxiosInstance.get(`/conversation/${id}`)
        return await handleAxiosApi<ApiResult<Conversation>>(responsePromise);
    },

    deleteConversation : async (id: string)  => {
        const responsePromise = comAxiosInstance.delete(`/conversation/${id}`);
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },

    //member
    addMembers :async (data: AddMembersDTO) =>{
        const responsePromise = comAxiosInstance.post(`/conversation/AddMembers`, data)
        return await handleAxiosApi<ApiResult<ConversationMember[]>>(responsePromise);
    },
    removeMember :async (data: RemoveMemberDTO) =>{
        const responsePromise = comAxiosInstance.post(`/conversation/RemoveMember`, data)
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },
    updateMemberRole :async (data: UpdateMemberRoleDTO) =>{
        const responsePromise = comAxiosInstance.post(`/conversation/UpdateMemberRole`, data)
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },

    //message
    getMessageHistory: async (data: GetMessagesHistoryDTO)=>{
        const responsePromise = comAxiosInstance.get('/conversation/GetMessagesHistory', {params: data})
        return await handleAxiosApi<ApiResult<Message[]>>(responsePromise);
    },
    sendMessage : async (data: SendMessageDTO)=>{
        const responsePromise = comAxiosInstance.post(`/conversation/SendMessage`, data)
        return await handleAxiosApi<ApiResult<Message>>(responsePromise);
    },

    //channel
    createChannel : async (data: CreateChannelDTO)=>{
        const responsePromise = comAxiosInstance.post(`/channel/CreateChannel`, data)
        return await handleAxiosApi<ApiResult<string>>(responsePromise);
    },

    getChannels : async (data?: GetListChannelDTO)=>{
        const responsePromise = comAxiosInstance.get('/channel/GetList', {params: data})
        return await handleAxiosApi<ApiResult<Channel[]>>(responsePromise);
    },

    getChannel : async (id: string)=>{
        const responsePromise = comAxiosInstance.get(`/channel/${id}`)
        return await handleAxiosApi<ApiResult<Channel>>(responsePromise);
    },

    updateChannelEventTypes : async (data: UpdateEventTypesChannelDTO)=>{
        const responsePromise = comAxiosInstance.post(`/channel/UpdateEventTypes`, data)
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },
    
    //event
    getEventsForMap : async (data : { eventTypeCodes : string[]})=>{
        const responsePromise = comAxiosInstance.get('/event/GetEventsForMap', {params: data})
        return await handleAxiosApi<ApiResult<EventInfo[]>>(responsePromise);
    },

    getChannelEventsHistory : async (data : GetEventsHistoryDTO)=>{
        const responsePromise = comAxiosInstance.get('/channel/GetChannelEventsHistory',  {params: data})
        return await handleAxiosApi<ApiResult<EventInfo[]>>(responsePromise);
    },
    
    sendEvent : async (data: SendEventDTO)=>{
        const responsePromise = comAxiosInstance.post(`/channel/SendEvent`, data)
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },

    getEventTypesForMe: async ()=>{
        const responsePromise = comAxiosInstance.get('/event/GetEventTypesForMe')
        return await handleAxiosApi<ApiResult<EventType[]>>(responsePromise);
    },

    getEventTypes: async ()=>{
        const responsePromise = comAxiosInstance.get('/settings/GetEventTypes')
        return await handleAxiosApi<ApiResult<EventType[]>>(responsePromise);
    },
    createEventType : async (data: CreateEventTypeDTO)=>{
        const responsePromise = comAxiosInstance.post(`/settings/CreateEventType`, data)
        return await handleAxiosApi<ApiResult<EventType>>(responsePromise);
    },
    updateEventType : async (data: UpdateEventTypeDTO)=>{
        const responsePromise = comAxiosInstance.post(`/settings/UpdateEventType`, data)
        return await handleAxiosApi<ApiResult<EventType>>(responsePromise);
    },
    deleteEventType : async (code: string)  => {
        const responsePromise = comAxiosInstance.delete(`/settings/EventType/${code}`);
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },

    //users
    getUsers : async (data? : GetListUserStatusDTO)=>{
        const responsePromise = comAxiosInstance.get('/userstatus/GetList', {params: data});
        return await handleAxiosApi<ApiResult<UserStatus[]>>(responsePromise);
    },
    getOnlineUsersForMap : async (data?: any)=>{
        const responsePromise = comAxiosInstance.get('/userstatus/GetOnlineUsersForMap', {params: data});
        return await handleAxiosApi<ApiResult<UserStatus[]>>(responsePromise);
    },

    //settings
    getSettings: async ()=>{
        const responsePromise = comAxiosInstance.get('/settings')
        return await handleAxiosApi<ApiResult<AppSettings[]>>(responsePromise);
    },
    updateSettings : async (code: string, value: string )=>{
        const responsePromise = comAxiosInstance.post(`/settings/Update`, {
            code,
            value
        })
        return await handleAxiosApi<ApiResult<AppSettings>>(responsePromise);
    },
}