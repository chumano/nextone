import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { comApi } from "../../apis/comApi";
import { Conversation } from "../../models/conversation/Conversation.model";
import { CreateChannelDTO, CreateConverationDTO, GetListChannelDTO, GetListConversationDTO, GetMessagesHistoryDTO, SendMessageDTO } from "../../models/dtos";
import { GetListUserStatusDTO } from "../../models/dtos/UserStatusDTOs";
import { Message } from "../../models/message/Message.model";
import { ChatMesageEventData } from "./chatPayload";
import { ChatState } from "./ChatState";


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

export const getChannels = createAsyncThunk(
    'chat/getChannels',
    async (data: GetListChannelDTO |undefined, thunkAPI) => {
        const response = await comApi.getChannels(data);
        return response
    }
)


//channel
export const createChannel = createAsyncThunk(
    'chat/createChannel',
    async (data: CreateChannelDTO, thunkAPI) => {
        const { dispatch } = thunkAPI;
        const createResponse = await comApi.createChannel(data);
        
        debugger
        const response = await comApi.getChannel(createResponse.data);
        debugger
        return response;
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

export const getMessageHistory = createAsyncThunk(
    'chat/getMessageHistory',
    async (data: GetMessagesHistoryDTO, thunkAPI) => {
        const response = await comApi.getMessageHistory(data);
        return response
    },
    {
      condition: (userId, { getState, extra }) => {
        const state = getState() as any
        console.log('getMessageHistory-state',state)
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

const initialState: ChatState = {
    conversationsLoading: false,
    conversations: [],
    channels: [],
    modals: {}
}
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUser:(state, action : PayloadAction<string>)=>{
            state.userId = action.payload;
        },
        showModal:(state, action: PayloadAction<{modal:string, visible:boolean}>)=>{
            const {modal ,visible } = action.payload
            state.modals[modal] = visible;
        },
        //conversation
        selectConversation:(state, action: PayloadAction<string>)=>{
            const conversationId = action.payload;
            state.selectedConversationId = conversationId;
        },

        //chat
        receiveChatEvent: (state, action: PayloadAction<ChatMesageEventData>)=>{
            const {chatKey, data}  = action.payload;
            switch(chatKey){
                case 'message':
                    {
                        const message = data as Message;
                        const conversation = state.conversations.find(o=>o.id === message.conversationId);
                        if(!conversation) return;
                        
                        if(message.userSender.userId!= state.userId){
                            conversation.messages.unshift(message)
                        }

                    }
                    break;
            }
        }

    },
    extraReducers: (builder) => {
        //conversation
        builder.addCase(getConversations.fulfilled, (state, action) => {
            const { payload } = action;
            state.conversationsLoading = false;
            if(payload.isSuccess){
                state.conversations = payload.data;
            }
        })

        builder.addCase(getConversations.pending, (state, action) => {
            state.conversationsLoading = true;
        })

        builder.addCase(getOrCreateConversation.fulfilled, (state, action) => {
            const { payload } = action;
            if(payload.isSuccess){
                state.selectedConversationId = payload.data.id;
                if(!state.conversations.find(o=>o.id == payload.data.id)){
                    state.conversations.unshift(payload.data)
                }
            }
        })

        builder.addCase(getConversation.fulfilled, (state, action) => {
            const { payload } = action;
        })


        builder.addCase(deleteConversation.fulfilled, (state, action) => {
            const { payload } = action;
        })

        //channel
        builder.addCase(getChannels.fulfilled, (state, action) => {
            const { payload } = action;
            state.conversationsLoading = false;
            if(payload.isSuccess){
                state.channels = payload.data;
            }
        })
        builder.addCase(createChannel.fulfilled, (state, action) => {
            const { payload } = action;
            if(payload.isSuccess){
                state.selectedConversationId = payload.data.id;
                if(!state.channels.find(o=>o.id == payload.data.id)){
                    state.channels.unshift(payload.data)
                }
            }
        })
        //member

        //message 
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const { payload } = action;
            if(payload.isSuccess){
                const message = payload.data;
                const conversation = state.conversations.find(o=>o.id === message.conversationId)
                if(conversation){
                    conversation.messages.unshift(message);
                }
                
            }
        })

        builder.addCase(getMessageHistory.fulfilled, (state, action) => {
            const { payload, meta :{arg}} = action;
            const conversationId = arg.conversationId;
            const conversation = state.conversations.find(o=>o.id === conversationId);
            if(!conversation) return;
            conversation.messagesLoading = false;
            if(payload.isSuccess){
                const messages = payload.data; //ngày giảm
                if(messages.length == 0) {
                    conversation!.messagesLoadMoreEmtpy = true;
                    return;
                }
                if(messages[0].conversationId == conversationId){
                     //ngày giảm
                     for(const oldMessage of messages){
                         if(!conversation.messages.find(o=>o.id === oldMessage.id)){
                            conversation.messages.push(oldMessage);
                         }
                     }
                     //conversation.messages = [...conversation.messages,...messages]
                }
            }
        })

        builder.addCase(getMessageHistory.pending, (state, action) => {
            const { payload, meta :{arg}} = action;
            const conversationId = arg.conversationId;
            const conversation = state.conversations.find(o=>o.id === conversationId);
            if(!conversation) return;
            conversation.messagesLoading = true;
        })

    },
})


export const chatActions = chatSlice.actions;
export default chatSlice.reducer;