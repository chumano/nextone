import {newsInitialState} from './news.state';
import {createSlice} from '@reduxjs/toolkit';
import {getList} from './news.thunk';

export const newsSlice = createSlice({
  name: 'news',
  initialState: newsInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getList.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getList.fulfilled, (state, action) => {
      const news = action.payload || [];
      state.data = news;
      state.status = 'success';
    });
    builder.addCase(getList.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });
  },
});

export default newsSlice.reducer;
