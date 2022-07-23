import {newsApi} from './../../apis/news';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {GetListNewsDTO} from '../../dto/NewsDTO.type';
export const getList = createAsyncThunk(
  'news/getList',
  async (data: GetListNewsDTO, {rejectWithValue}) => {
    try {
      const response = await newsApi.list('', data);

      if (response.isSuccess) return response.data;
      else return rejectWithValue(response.errorMessage as string);
    } catch (error) {
      rejectWithValue(`event/getEventsByMe failed: ${error}`);
    }
  },
);
