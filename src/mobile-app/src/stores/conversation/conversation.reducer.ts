import {createSlice} from '@reduxjs/toolkit';
import {conversationInitialState} from './conversation.state';
import {
  getListConversation,
  getMessagesHistory,
  sendMessage,
} from './conversation.thunk';

import {Conversation} from './../../types/Conversation/Conversation.type';

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState: conversationInitialState,
  reducers: {},
  extraReducers: builder => {
    //conversation
    builder.addCase(getListConversation.pending, (state,action) => {
      const {arg: {loadMore}} = action.meta;
      state.conversationsLoading =true;
    });

    builder.addCase(getListConversation.fulfilled, (state, action) => {
      const conversations =  action.payload as Conversation[];
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

    //message
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
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });

    builder.addCase(getMessagesHistory.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getMessagesHistory.fulfilled, (state, action) => {
      const listMessage = action.payload;
      const {arg} = action.meta;

      if (!listMessage || !state.data) {
        state.allLoaded = true;
        return;
      }

      state.status = 'success';

      if (listMessage.length === 0) {
        state.allLoaded = true;
        return;
      }

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
    });
  },
});

export default conversationSlice.reducer;
