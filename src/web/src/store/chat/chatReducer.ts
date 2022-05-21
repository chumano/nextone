import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { comApi } from "../../apis/comApi";
import { Conversation } from "../../models/conversation/Conversation.model";
import { ConversationMember } from "../../models/conversation/ConversationMember.model";
import { AddMembersDTO, CreateChannelDTO, CreateConverationDTO, GetListChannelDTO, GetListConversationDTO, GetMessagesHistoryDTO, RemoveMemberDTO, SendMessageDTO, UpdateMemberRoleDTO } from "../../models/dtos";
import { GetListUserStatusDTO } from "../../models/dtos/UserStatusDTOs";
import { Message } from "../../models/message/Message.model";
import { ChatMesageEventData } from "./chatPayload";
import { ChatState, ConversationState } from "./ChatState";


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
    allConversations: [],
    modals: {},
    modalDatas : {}
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUser:(state, action : PayloadAction<string>)=>{
            state.userId = action.payload;
        },
        showModal:(state, action: PayloadAction<{modal:string, visible:boolean, data?: any}>)=>{
            const {modal ,visible, data } = action.payload
            state.modals[modal] = visible;
            if(visible){
                state.modalDatas[modal] = data;
            }else{
                state.modalDatas[modal]= undefined;
            }
        },
        //conversation
        selectConversation:(state, action: PayloadAction<string>)=>{
            const conversationId = action.payload;
            state.selectedConversationId = conversationId;
            state.isShowConversationInfo = false;
        },

        toggleConversationInfo:(state)=>{
            state.isShowConversationInfo = !state.isShowConversationInfo;
        },

        //member
        addMembers : (state, action: PayloadAction<{conversationId:string, members: ConversationMember[]}>)=>{
            const {conversationId, members} = action.payload;
            const conversation = state.allConversations.find(o=>o.id === conversationId);
            if(!conversation) return;
            conversation.members = [...conversation.members, ...members];
        },

        updateMemberRole: (state, action: PayloadAction<{conversationId:string, member: ConversationMember}>)=>{
            const {conversationId, member} = action.payload;
            const conversation = state.allConversations.find(o=>o.id === conversationId);
            if(!conversation) return;
            conversation.members = conversation.members.map(o=>{
                if(o.userMember.userId== member.userMember.userId){
                    return member;
                }
                return o;
            })
        },
        deleteMember: (state, action: PayloadAction<{conversationId:string, member: ConversationMember}>)=>{
            const {conversationId, member} = action.payload;
            const conversation = state.allConversations.find(o=>o.id === conversationId);
            if(!conversation) return;
            conversation.members = conversation.members.filter(o=>o.userMember.userId!= member.userMember.userId);
        },

        //chat
        receiveChatEvent: (state, action: PayloadAction<ChatMesageEventData>)=>{
            const {chatKey, data}  = action.payload;
            switch(chatKey){
                case 'message':
                    {
                        const message = data as Message;
                        const conversation = state.allConversations.find(o=>o.id === message.conversationId);
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
                state.conversations = payload.data as ConversationState[];
                state.allConversations =[...state.channels, ...state.conversations]
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
                    state.conversations.unshift(payload.data as ConversationState)
                    state.allConversations =[...state.channels, ...state.conversations]
                }
            }
        })

        builder.addCase(getConversation.fulfilled, (state, action) => {
            const { payload } = action;
            
        })

        builder.addCase(deleteConversation.fulfilled, (state, action) => {
            const { payload , meta} = action;
            const conversationId = meta.arg;
            if(payload.isSuccess){
                state.selectedConversationId = undefined;
                state.conversations = state.conversations.filter(o=>o.id != conversationId);
                state.channels = state.channels.filter(o=>o.id != conversationId);
                state.allConversations =[...state.channels, ...state.conversations]
            }
        })

        //channel
        builder.addCase(getChannels.fulfilled, (state, action) => {
            const { payload } = action;
            state.conversationsLoading = false;
            if(payload.isSuccess){
                state.channels = payload.data;
                state.allConversations =[...state.channels, ...state.conversations]
            }
        })
        builder.addCase(createChannel.fulfilled, (state, action) => {
            const { payload } = action;
            if(payload.isSuccess){
                state.selectedConversationId = payload.data.id;
                if(!state.channels.find(o=>o.id == payload.data.id)){
                    state.channels.unshift(payload.data)
                    state.allConversations =[...state.channels, ...state.conversations]
                }
            }
        })

        //message 
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const { payload } = action;
            if(payload.isSuccess){
                const message = payload.data;
                const conversation = state.allConversations.find(o=>o.id === message.conversationId)
                if(conversation){
                    conversation.messages.unshift(message);
                }
                
            }
        })

        builder.addCase(getMessageHistory.fulfilled, (state, action) => {
            const { payload, meta :{arg}} = action;
            const conversationId = arg.conversationId;
            const conversation = state.allConversations.find(o=>o.id === conversationId);
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
            const conversation = state.allConversations.find(o=>o.id === conversationId);
            if(!conversation) return;
            conversation.messagesLoading = true;
        })

    },
})


export const chatActions = chatSlice.actions;
export default chatSlice.reducer;