import {createAsyncThunk} from '@reduxjs/toolkit';

import {conversationApi} from './../../apis/conversation.api';

import {IPageOptions, PageOptions} from './../../types/PageOptions.type';
import {SendMessageDTO} from './../../dto/ConversationDTO.type';

export const getListConversation = createAsyncThunk(
  'conversation/getList',
  async (data: IPageOptions | undefined, {rejectWithValue}) => {
    let pageOptions = data;
    if (typeof data === undefined) {
      pageOptions = new PageOptions();
    }

    try {
      const response = await conversationApi.getListConversation(pageOptions);
      const result = response.data;
      if (result.isSuccess) return result.data;
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
