import { createAsyncThunk } from "@reduxjs/toolkit";
import { comApi } from "../../apis/comApi";
import { CreateChannelDTO, CreateConverationDTO, GetListChannelDTO, GetListConversationDTO, GetMessagesHistoryDTO, SendMessageDTO } from "../../models/dtos";
import { GetListUserStatusDTO } from "../../models/dtos/UserStatusDTOs";

//conversation
export const getOrCreateConversation = createAsyncThunk(
    'chat/getOrCreateConversation',
    async (data: CreateConverationDTO, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const createResponse = await comApi.getOrCreateConversation(data);
        const response = await comApi.getConversation(createResponse.data)
        return response;
    }
)

export const getConversation = createAsyncThunk(
    'chat/getConversation',
    async (id: string, thunkAPI) => {
        const response = await comApi.getConversation(id);
        return response
    }
)

export const getConversations = createAsyncThunk(
    'chat/getConversations',
    async (data: GetListConversationDTO |undefined, thunkAPI) => {
        const response = await comApi.getConversations(data);
        return response
    }
)

export const deleteConversation = createAsyncThunk(
    'chat/deleteConversation',
    async (id: string, thunkAPI) => {
        const response = await comApi.deleteConversation(id);
        return response
    }
)

//message
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (data: SendMessageDTO, thunkAPI) => {
        const response = await comApi.sendMessage(data);
        return response
    }
)

//channel
export const getChannels = createAsyncThunk(
    'chat/getChannels',
    async (data: GetListChannelDTO |undefined, thunkAPI) => {
        const response = await comApi.getChannels(data);
        return response
    }
)

export const createChannel = createAsyncThunk(
    'chat/createChannel',
    async (data: CreateChannelDTO, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const createResponse = await comApi.createChannel(data);
        const response = await comApi.getChannel(createResponse.data);
        return response;
    }
)

export const getMessageHistory = createAsyncThunk(
    'chat/getMessageHistory',
    async (data: GetMessagesHistoryDTO, thunkAPI) => {
        const response = await comApi.getMessageHistory(data);
        return response
    },
    {
      condition: (userId, { getState, extra }) => {
        const state = getState() as any
       // console.log('getMessageHistory-state',state)
        // const fetchStatus = users.requests[userId]
        // if (fetchStatus === 'fulfilled' || fetchStatus === 'loading') {
        //   // Already fetched or in progress, don't need to re-fetch
        //   return false
        // }
        return true;
      },
    }
)

//userstatus
export const getUsers = createAsyncThunk(
    'chat/getUsers',
    async (data: GetListUserStatusDTO |undefined, thunkAPI) => {
        const response = await comApi.getUsers(data);
        return response
    }
)