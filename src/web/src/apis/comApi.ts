import axios from "axios";
import { ApiResult } from "../models/apis/ApiResult.model";
import { Conversation } from "../models/conversation/Conversation.model";
import { AddMembersDTO, CreateChannelDTO, CreateConverationDTO , GetEventsHistoryDTO, GetListConversationDTO, GetMessagesHistoryDTO, RemoveMemberDTO, SendEventDTO, SendMessageDTO, UpdateEventTypesChannelDTO, UpdateMemberRoleDTO} from "../models/dtos";
import { GetListUserStatusDTO } from "../models/dtos/UserStatusDTOs";
import { Message } from "../models/message/Message.model";
import { UserStatus } from "../models/user/UserStatus.model";
import { createAxios } from "../utils";
import { handleAxiosApi } from "../utils/functions";

const comAxiosInstance = createAxios('http://localhost:5104');
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
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
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
    updateChannelEventTypes : async (data: UpdateEventTypesChannelDTO)=>{
        const responsePromise = comAxiosInstance.post(`/channel/UpdateEventTypes`, data)
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },
    getEventsHistory : async (data : GetEventsHistoryDTO)=>{
        const responsePromise = comAxiosInstance.get('/channel/GetEventsHistory', data)
        return await handleAxiosApi<ApiResult<Message[]>>(responsePromise);
    },
    sendEvent : async (data: SendEventDTO)=>{
        const responsePromise = comAxiosInstance.post(`/channel/SendEvent`, data)
        return await handleAxiosApi<ApiResult<undefined>>(responsePromise);
    },

    //users
    getUsers : async (data? : GetListUserStatusDTO)=>{
        const responsePromise = comAxiosInstance.get('/userstatus/GetList', {params: data});
        return await handleAxiosApi<ApiResult<UserStatus[]>>(responsePromise);
    },
}