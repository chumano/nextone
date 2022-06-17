import {getEventsByMe} from './event.thunk';
import {createSlice} from '@reduxjs/toolkit';

import {eventInitialState} from './event.state';

export const eventSlice = createSlice({
  name: 'event',
  initialState: eventInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getEventsByMe.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getEventsByMe.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.data = action.payload;
      state.status = 'success';
    });
    builder.addCase(getEventsByMe.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });
  },
});

export default eventSlice.reducer;
