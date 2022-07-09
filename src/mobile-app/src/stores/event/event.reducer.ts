import {getEventsByMe} from './event.thunk';
import {createSlice} from '@reduxjs/toolkit';

import {eventInitialState} from './event.state';

export const eventSlice = createSlice({
  name: 'event',
  initialState: eventInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getEventsByMe.pending, state => {
      state.eventsLoading =true;
    });
    builder.addCase(getEventsByMe.fulfilled, (state, action) => {
      const events = action.payload || []
      const {arg: {loadMore}} = action.meta;

      if(events.length >0){
        state.allLoaded = false;
      }else{
        state.allLoaded = true;
      }

      if(loadMore){
        const existEvents = state.data || [];
        state.data = [...existEvents,  ...events]
      }else{
        state.data = events;
      }
      state.eventsOffset =  state.data.length;
      state.eventsLoading = false;
      state.status = 'success';
    });
    builder.addCase(getEventsByMe.rejected, (state, action) => {
      state.error = action.payload as string;
      state.allLoaded = true;
      state.eventsLoading = false;
      state.status = 'failed';
    });
  },
});

export default eventSlice.reducer;
