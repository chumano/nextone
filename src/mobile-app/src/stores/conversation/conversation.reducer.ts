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
    builder.addCase(getListConversation.pending, state => {
      state.status = 'loading';
    });

    builder.addCase(getListConversation.fulfilled, (state, action) => {
      state.data = action.payload as Conversation[];
      state.status = 'success';
    });
    
    builder.addCase(getListConversation.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });

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
