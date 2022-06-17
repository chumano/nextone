import {GetEventsByMeDTO} from './../../dto/EventDTO.type';
import {eventApi} from './../../apis/event.api';
import {createAsyncThunk} from '@reduxjs/toolkit';
export const getEventsByMe = createAsyncThunk(
  'event/getEventsByMe',
  async (data: GetEventsByMeDTO, {rejectWithValue}) => {
    try {
      const response = await eventApi.getEventsByMe(data);
      const result = response.data;
      if (result.isSuccess) return result.data;
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`event/getEventsByMe failed: ${error}`);
    }
  },
);
