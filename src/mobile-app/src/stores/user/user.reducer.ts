import {createSlice} from '@reduxjs/toolkit';
import {userInitialState} from './user.state';
import {changeMyPassword, getMyProfile, updateMyProfile} from './user.thunk';

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getMyProfile.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.data = action.payload;
      state.status = 'success';
    });
    builder.addCase(getMyProfile.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });

    builder.addCase(updateMyProfile.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(updateMyProfile.fulfilled, (state, action) => {
      if (!state.data || !action.payload) return;
      state.data.name = action.payload.name;
      state.data.phone = action.payload.phone;
      state.status = 'success';
    });
    builder.addCase(updateMyProfile.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });

    builder.addCase(changeMyPassword.pending, state => {
      state.status = 'loading';
    });
    builder.addCase(changeMyPassword.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.status = 'success';
    });
    builder.addCase(changeMyPassword.rejected, (state, action) => {
      state.error = action.payload as string;
      state.status = 'failed';
    });
  },
});

export default userSlice.reducer;
