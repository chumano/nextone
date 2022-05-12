import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { comApi } from "../../apis/comApi";
import { CreateConverationDTO, GetListConversationDTO, GetMessagesHistoryDTO, SendMessageDTO } from "../../models/dtos";
import { ChatState } from "./ChatState";

export const createConversation = createAsyncThunk(
    'chat/createConversation',
    async (data: CreateConverationDTO, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const createResponse = await comApi.createConversation(data);
        const response = await getConversation(createResponse.Data)
        return response;
    }
)
export const getConversation = createAsyncThunk(
    'chat/getConversation',
    async (id: string, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await comApi.getConversation(id);
        return response
    }
)

export const getConversations = createAsyncThunk(
    'chat/getConversations',
    async (data: GetListConversationDTO |undefined, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await comApi.getConversations(data);
        return response
    }
)

export const deleteConversation = createAsyncThunk(
    'chat/deleteConversation',
    async (id: string, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await comApi.deleteConversation(id);
        return response
    }
)

//message
const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (data: SendMessageDTO, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await comApi.sendMessage(data);
        return response
    }
)

const getMessageHistory = createAsyncThunk(
    'chat/getMessageHistory',
    async (data: GetMessagesHistoryDTO, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const response = await comApi.getMessageHistory(data);
        return response
    }
)

const initialState: ChatState = {
    conversations: [],
    channels: [],
}
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        fetchData: (state) =>{

        },
        //message
        sendMessage: (state) => {

        },

    },
    extraReducers: (builder) => {
        //conversation
        builder.addCase(createConversation.fulfilled, (state, action) => {
            const { payload } = action;
        })

        builder.addCase(getConversation.fulfilled, (state, action) => {
            const { payload } = action;
        })

        builder.addCase(getConversations.fulfilled, (state, action) => {
            const { payload } = action;
        })

        builder.addCase(deleteConversation.fulfilled, (state, action) => {
            const { payload } = action;
        })

        //member

        //message 
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const { payload } = action;
        })

        builder.addCase(getMessageHistory.fulfilled, (state, action) => {
            const { payload } = action;
        })
    },
})


export const chatActions = chatSlice.actions;
export default chatSlice.reducer;