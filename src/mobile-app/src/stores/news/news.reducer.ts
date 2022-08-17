import {newsInitialState} from './news.state';
import {createSlice} from '@reduxjs/toolkit';
import {getList} from './news.thunk';

export const newsSlice = createSlice({
  name: 'news',
  initialState: newsInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getList.pending, state => {
      state.newsLoading = true;
    });
    builder.addCase(getList.fulfilled, (state, action) => {
      const news = action.payload || [];
      const {
        arg: {loadMore},
      } = action.meta;
      
      if (news.length > 0) {
        state.allLoaded = false;
      } else {
        state.allLoaded = true;
      }

      if (loadMore) {
        const existNews = state.data || [];
        state.data = [...existNews, ...news];
      } else {
        state.data = news;
      }

      state.newsOffset = state.data.length;
      state.newsLoading = false;
      state.status = 'success';
    });
    builder.addCase(getList.rejected, (state, action) => {
      state.error = action.payload as string;
      state.allLoaded = true;
      state.newsLoading = false;
      state.status = 'failed';
    });
  },
});

export default newsSlice.reducer;
