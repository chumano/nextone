import {newsApi} from './../../apis/news';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {GetListNewsDTO} from '../../dto/NewsDTO.type';
import {PageOptions} from '../../types/PageOptions.type';
export const getList = createAsyncThunk(
  'news/getList',
  async (
    data: {params: GetListNewsDTO; loadMore?: boolean},
    {rejectWithValue},
  ) => {
    try {
      let pageOptions = {
        pageSize: data.params.pageSize,
        offset: data.params.offset,
      } as PageOptions;
      if (typeof data === undefined || !data.params.pageSize) {
        pageOptions.pageSize = new PageOptions().pageSize;
      }

      const response = await newsApi.list('', {
        ...pageOptions,
        publishState: 0,
      });

      if (response.isSuccess) return response.data;
      else return rejectWithValue(response.errorMessage as string);
    } catch (error) {
      rejectWithValue(`event/getEventsByMe failed: ${error}`);
    }
  },
);
