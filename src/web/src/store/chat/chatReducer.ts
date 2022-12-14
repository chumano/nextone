import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { Conversation } from "../../models/conversation/Conversation.model";
import { ConversationMember } from "../../models/conversation/ConversationMember.model";
import { ConversationType } from "../../models/conversation/ConversationType.model";
import { Message } from "../../models/message/Message.model";
import { Status } from "../../models/user/UserStatus.model";
import { ChatMesageEventData } from "./chatPayload";
import { ChatState, ConversationState } from "./ChatState";
import { createChannel, deleteConversation, getChannels, getConversation, getConversations, getMessageHistory, getOrCreateConversation, sendMessage } from './chatThunks'

const initialState: ChatState = {
    conversationsLoading: false,

    conversations: [],
    channels: [],
    allConversations: [],

    modals: {},
    modalDatas: {}
}

const conversationUpdated = (state: ChatState, conversation: ConversationState)=>{
    if(conversation.type === ConversationType.Channel){
        state.channels = state.channels.filter(o=>o.id !== conversation.id);
        state.channels.unshift(conversation as ConversationState);
    }else{
        state.conversations = state.conversations.filter(o=>o.id !== conversation.id);
        state.conversations.unshift(conversation as ConversationState);
    }
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
        },
        showModal: (state, action: PayloadAction<{ modal: string, visible: boolean, data?: any }>) => {
            const { modal, visible, data } = action.payload
            state.modals[modal] = visible;
            if (visible) {
                state.modalDatas[modal] = data;
            } else {
                state.modalDatas[modal] = undefined;
            }
        },
        //conversation,
        updateConversationName: (state, action: PayloadAction<{id: string, name:string}>)=>{
            const { id, name } = action.payload;
            const conversation = state.allConversations.find(o => o.id === id);
            if (!conversation) return;
            conversation.name = name;
            conversationUpdated(state, conversation);
        },
        addConversationOrChannel : (state, action : PayloadAction<Conversation>)=>{
            const conversation = action.payload;
            if (!state.allConversations.find(o => o.id === conversation.id)) {
               
                if(conversation.type === ConversationType.Channel){
                    state.channels.unshift(conversation as ConversationState)
                }else{
                    state.conversations.unshift(conversation as ConversationState)
                }
                
                state.allConversations = [...state.channels, ...state.conversations]
            }
            
        },
        selectConversation: (state, action: PayloadAction<string>) => {
            const conversationId = action.payload;
            state.selectedConversationId = conversationId;
            state.isShowConversationInfo = false;
        },

        toggleConversationInfo: (state) => {
            state.isShowConversationInfo = !state.isShowConversationInfo;
        },

        //member
        addMembers: (state, action: PayloadAction<{ conversationId: string, members: ConversationMember[] }>) => {
            const { conversationId, members } = action.payload;
            const conversation = state.allConversations.find(o => o.id === conversationId);
            if (!conversation) return;
            conversation.members = [...conversation.members, ...members];

            conversationUpdated(state, conversation);
        },

        updateMemberRole: (state, action: PayloadAction<{ conversationId: string, member: ConversationMember }>) => {
            const { conversationId, member } = action.payload;
            const conversation = state.allConversations.find(o => o.id === conversationId);
            if (!conversation) return;
            conversation.members = conversation.members.map(o => {
                if (o.userMember.userId == member.userMember.userId) {
                    return member;
                }
                return o;
            });

            conversationUpdated(state, conversation);
        },
        deleteMember: (state, action: PayloadAction<{ conversationId: string, member: ConversationMember }>) => {
            const { conversationId, member } = action.payload;
            const conversation = state.allConversations.find(o => o.id === conversationId);
            if (!conversation) return;
            conversation.members = conversation.members.filter(o => o.userMember.userId != member.userMember.userId);
        
            conversationUpdated(state, conversation);
        },

        //chat
        receiveChatEvent: (state, action: PayloadAction<ChatMesageEventData>) => {
            const { chatKey, data } = action.payload;
            switch (chatKey) {
                case 'message':
                    {
                        const message = data as Message;
                        const conversation = state.allConversations.find(o => o.id === message.conversationId);
                        if (!conversation) {
                            state.notLoadedConversationId = message.conversationId;
                            return;
                        }
                        
                        const existMessageId = message.id;
                        const index = conversation.messages.findIndex(o => {
                            return o.id === existMessageId;
                        })

                        if (index !== -1) {
                            conversation.messages[index] = message;
                        } else {
                            conversation.messages.unshift(message)
                        }

                        conversationUpdated(state, conversation);
                    }
                    break;
                case 'user':
                    {
                        const {userId, isOnline} = data ;
                        //TODO: update user status of conversation
                        state.allConversations.forEach(conversation=>{
                            conversation.members = conversation.members.map(o=>{
                                if(o.userMember.userId === userId){
                                    o.userMember = {
                                        ...o.userMember,
                                        status : isOnline? Status.Online: Status.Offline
                                    }
                                }
                                return o;
                            })
                        })

                    }
                    break;
            }
        },
        //message
        addTempMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            const conversation = state.allConversations.find(o => o.id === message.conversationId);
            if (!conversation) return;

            conversation.messages.unshift(message);

            conversationUpdated(state, conversation);
        },

        updateMessage: (state, action: PayloadAction<{ messageId: string, message: Message }>) => {
            const { message, messageId } = action.payload;
            const conversation = state.allConversations.find(o => o.id === message.conversationId);
            if (!conversation) return;

            const existMessageId = messageId;
            let messages = conversation.messages;
            if(existMessageId !== message.id){
                //fake message
                messages = messages.filter(o=>o.id !== message.id);
            }
            conversation.messages = messages.map(o => {
                if (o.id === existMessageId) {
                    return message
                }
                return o;
            })

            conversationUpdated(state, conversation);
        },

        //events
        deleteChannelEvent: (state, action: PayloadAction<{ channelId: string, eventId: string }>) => {
            const { channelId, eventId } = action.payload;
            const conversation = state.allConversations.find(o => o.id === channelId);
            if (!conversation) return;
            conversation.events = conversation.events.filter(o => o.id != eventId);
            conversation.messages = conversation.messages.filter(o=> o.event?.id !== eventId);
        
            conversationUpdated(state, conversation);
        },
    },
    extraReducers: (builder) => {
        //conversation
        builder.addCase(getConversations.fulfilled, (state, action) => {
            const { payload } = action;
            state.conversationsLoading = false;
            if (payload.isSuccess) {
                state.conversations = payload.data as ConversationState[];
                state.allConversations = [...state.channels, ...state.conversations]
            }
        })

        builder.addCase(getConversations.pending, (state, action) => {
            state.conversationsLoading = true;
        })

        builder.addCase(getOrCreateConversation.fulfilled, (state, action) => {
            const { payload } = action;
            if (payload.isSuccess) {
                state.isShowConversationInfo = false;
                state.selectedConversationId = payload.data.id;
                if (!state.conversations.find(o => o.id == payload.data.id)) {
                    state.conversations.unshift(payload.data as ConversationState)
                    state.allConversations = [...state.channels, ...state.conversations]
                }
            }
        })

        builder.addCase(getConversation.fulfilled, (state, action) => {
            const { payload } = action;

        })

        builder.addCase(deleteConversation.fulfilled, (state, action) => {
            const { payload, meta } = action;
            const conversationId = meta.arg;
            if (payload.isSuccess) {
                state.selectedConversationId = undefined;
                state.conversations = state.conversations.filter(o => o.id != conversationId);
                state.channels = state.channels.filter(o => o.id != conversationId);
                state.allConversations = [...state.channels, ...state.conversations]
            }
        })

        //channel
        builder.addCase(getChannels.fulfilled, (state, action) => {
            const { payload } = action;
            state.conversationsLoading = false;
            if (payload.isSuccess) {
                state.channels = payload.data;
                state.allConversations = [...state.channels, ...state.conversations]
            }
        })
        builder.addCase(createChannel.fulfilled, (state, action) => {
            const { payload } = action;
            if (payload.isSuccess) {
                state.selectedConversationId = payload.data.id;
                if (!state.channels.find(o => o.id == payload.data.id)) {
                    state.channels.unshift(payload.data)
                    state.allConversations = [...state.channels, ...state.conversations]
                }
            }
        })

        //message 
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const { payload } = action;
            if (payload.isSuccess) {
                const message = payload.data;
                const conversation = state.allConversations.find(o => o.id === message.conversationId)
                if (!conversation) return;

                const existMessageId = message.id;
                const index = conversation.messages.findIndex(o => {
                    return o.id == existMessageId;
                })

                if (index !== -1) {
                    conversation.messages[index] = message;
                } else {
                    conversation.messages.unshift(message)
                }

                conversationUpdated(state, conversation);
            }
        })

        builder.addCase(getMessageHistory.fulfilled, (state, action) => {
            const { payload, meta: { arg } } = action;
            const conversationId = arg.conversationId;
            const conversation = state.allConversations.find(o => o.id === conversationId);
            if (!conversation) return;
            conversation.messagesLoading = false;
            if (payload.isSuccess) {
                const messages = payload.data; //ngày giảm
                if (messages.length == 0) {
                    conversation!.messagesLoadMoreEmtpy = true;
                    return;
                }
                if (messages[0].conversationId == conversationId) {
                    //ngày giảm
                    for (const oldMessage of messages) {
                        if (!conversation.messages.find(o => o.id === oldMessage.id)) {
                            conversation.messages.push(oldMessage);
                        }
                    }
                    //conversation.messages = [...conversation.messages,...messages]
                }
            }
        })

        builder.addCase(getMessageHistory.pending, (state, action) => {
            const { payload, meta: { arg } } = action;
            const conversationId = arg.conversationId;
            const conversation = state.allConversations.find(o => o.id === conversationId);
            if (!conversation) return;
            conversation.messagesLoading = true;
        })

    },
})


export const chatActions = chatSlice.actions;
export default chatSlice.reducer;