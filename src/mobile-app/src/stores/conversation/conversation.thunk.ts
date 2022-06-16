import {createAsyncThunk} from '@reduxjs/toolkit';

import {conversationApi} from './../../apis/conversation.api';

import {IPageOptions, PageOptions} from './../../types/PageOptions.type';
import {
  GetMessagesHistoryDTO,
  SendMessageDTO,
} from './../../dto/ConversationDTO.type';
import { ConversationState } from './conversation.state';

export const getListConversation = createAsyncThunk(
  'conversation/getList',
  async ( data: { pageOptions :IPageOptions | undefined, loadMore?: boolean} , {rejectWithValue,getState}) => {
    const state = getState() as ConversationState;

    let pageOptions = data.pageOptions;
    if (typeof data === undefined || !data.pageOptions) {
      pageOptions = new PageOptions();
    }

    try {
      const response = await conversationApi.getListConversation(pageOptions);
      const result = response.data;
      if (result.isSuccess) {
        return result.data;
      }
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`conversation/getList failed: ${error}`);
    }
  },
);

export const sendMessage = createAsyncThunk(
  'conversation/sendMessage',
  async (data: SendMessageDTO, {rejectWithValue}) => {
    try {
      const response = await conversationApi.sendMessage(data);
      const result = response.data;
      if (result.isSuccess) return result.data;
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`conversation/sendMessage failed: ${error}`);
    }
  },
);

export const getMessagesHistory = createAsyncThunk(
  'conversation/getMessageHistory',
  async (data: GetMessagesHistoryDTO, {rejectWithValue}) => {
    try {
      const response = await conversationApi.getMessagesHistory(data);
      const result = response.data;
      if (result.isSuccess) return result.data;
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`conversation/getMessagesHistory failed: ${error}`);
    }
  },
);
