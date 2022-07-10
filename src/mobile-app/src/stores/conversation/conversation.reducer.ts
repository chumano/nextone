import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {conversationInitialState, ConversationState} from './conversation.state';
import {
  getListConversation,
  getMessagesHistory,
  sendMessage,
} from './conversation.thunk';

import {Conversation} from './../../types/Conversation/Conversation.type';
import { ChatData } from './conversation.payloads';
import { Message } from '../../types/Message/Message.type';
import { Status } from '../../types/User/UserStatus.type';

const conversationUpdated = (state: ConversationState, conversation: Conversation)=>{
  const conversations = state.data || [];
  state.data = conversations.filter(o=>o.id !== conversation.id);
  state.data.unshift(conversation);
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState: conversationInitialState,
  reducers: {
    selectConversation: (state, action: PayloadAction<string>) => {
      state.messagesAllLoaded = false;
      state.seletetedConversationId = action.payload;
    },
    //conversation
    addConversation : (state, action : PayloadAction<Conversation>)=>{
        const conversation = action.payload;
        const conversations = state.data || []
        if (!conversations.find(o => o.id === conversation.id)) {
          conversations.unshift(conversation)
          state.data = conversations;
        }
    },
    receiveChatData: (state, action: PayloadAction<ChatData>) => {
      const { chatKey, data } = action.payload;
      console.log('[receiveChatData] ', action.payload)
      const conversations = state.data || []
      switch (chatKey) {
          case 'message':
              {
                  const message = data as Message;
                  console.log('[receiveChatData]-message', message.id)
                  const conversation =conversations.find(o => o.id === message.conversationId);
                  if (!conversation) {
                      console.log('not exist conversation', message.conversationId)
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
                  conversations.forEach(conversation=>{
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
    
    addTempMessage: (state, action: PayloadAction<Message>) => {
      const conversations = state.data || []
      const message = action.payload;
      const conversation = conversations.find(o => o.id === message.conversationId);
      if (!conversation) return;

      conversation.messages.unshift(message);
      conversationUpdated(state, conversation);
    },
    updateMessage: (state, action: PayloadAction<{ messageId: string, message: Message }>) => {
      const conversations = state.data || []
      const { message, messageId } = action.payload;
      const conversation = conversations.find(o => o.id === message.conversationId);
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
  }
  },
  extraReducers: builder => {
    
    //conversations
    builder.addCase(getListConversation.pending, (state,action) => {
      const {arg: {loadMore}} = action.meta;
      state.conversationsLoading =true;
    });

    builder.addCase(getListConversation.fulfilled, (state, action) => {
      const conversations =  action.payload as Conversation[] || [];
      const {arg: {loadMore}} = action.meta;

      if(conversations.length >0){
        state.allLoaded = false;
      }else{
        state.allLoaded = true;
      }

      if(loadMore){
        const existConversations = state.data || [];
        state.data = [...existConversations,
        ...conversations]
      }else{
        state.data = conversations;
      }
      state.conversationsOffset =  state.data.length;
      state.conversationsLoading = false;
      state.status = 'success';
    });
    
    builder.addCase(getListConversation.rejected, (state, action) => {
      const {arg: {loadMore}} = action.meta;
      state.error = action.payload as string;
      state.allLoaded = true;
      state.conversationsLoading = false;
      state.status = 'failed';
    });

    //messages
    builder.addCase(sendMessage.pending, state => {
      state.status = 'loading';
    });

    builder.addCase(sendMessage.fulfilled, (state, action) => {
      const message = action.payload;

      if (!message || !state.data) return;
      const conversationHaveMessage = state.data.find(
        c => c.id === message.conversationId,
      );
      if (!conversationHaveMessage) return;

      const existMessageId = message.id;
      const index = conversationHaveMessage.messages.findIndex(
        m => m.id === existMessageId,
      );

      if (index !== -1) {
        conversationHaveMessage.messages[index] = message;
      } else {
        conversationHaveMessage.messages.unshift(message);
      }

      state.status = 'success';
      conversationUpdated(state, conversationHaveMessage);
    });

    builder.addCase(sendMessage.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });

    builder.addCase(getMessagesHistory.pending, state => {
      state.status = 'loading';
      state.messagesLoading = true;
    });

    builder.addCase(getMessagesHistory.fulfilled, (state, action) => {
      const listMessage = action.payload;
      const {arg} = action.meta;

      state.messagesLoading = false;

      if (!listMessage || !state.data) {
        state.messagesAllLoaded = true;
        return;
      }

      state.status = 'success';

      if (listMessage.length === 0) {
        state.messagesAllLoaded = true;
        return;
      }

      state.messagesAllLoaded = false;
      const getConversationId = listMessage[0].conversationId;
      const conversationHaveMessage = state.data.find(
        o => o.id === getConversationId,
      );

      if (!conversationHaveMessage) return;

      for (const oldMessage of listMessage) {
        const isMessageExist = conversationHaveMessage.messages.find(
          m => m.id === oldMessage.id,
        );
        if (!isMessageExist) {
          conversationHaveMessage.messages.push(oldMessage);
        }
      }

      
    });

    builder.addCase(getMessagesHistory.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
      state.messagesLoading = false;
    });
  },
});

export default conversationSlice.reducer;
