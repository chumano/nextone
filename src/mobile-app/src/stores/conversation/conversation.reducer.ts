import {createSlice} from '@reduxjs/toolkit';
import {conversationInitialState} from './conversation.state';
import {getListConversation, sendMessage} from './conversation.thunk';

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
      state.status = 'pending';
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
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });
  },
});

export default conversationSlice.reducer;
