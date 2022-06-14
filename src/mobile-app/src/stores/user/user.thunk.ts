import {createAsyncThunk} from '@reduxjs/toolkit';

import {userApi} from './../../apis/user.api';

import {UpdateProfileDTO, ChangePasswordDTO} from './../../dto/UserDTO.type';

export const getMyProfile = createAsyncThunk(
  'user/getMyProfile',
  async (_, {rejectWithValue}) => {
    try {
      const response = await userApi.getMyProfile();
      const result = response.data;
      if (result.isSuccess) return result.data;
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`user/getMyProfile failed: ${error}`);
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  'user/updateMyProfile',
  async (data: UpdateProfileDTO, {rejectWithValue}) => {
    try {
      const response = await userApi.updateMyProfile(data);
      const result = response.data;
      if (result.isSuccess) return data;
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`user/updateMyProfile failed: ${error}`);
    }
  },
);

export const changeMyPassword = createAsyncThunk(
  'user/changePassword',
  async (data: ChangePasswordDTO, {rejectWithValue}) => {
    try {
      const response = await userApi.changeMyPassword(data);
      const result = response.data;
      if (result.isSuccess) return result.data;
      else return rejectWithValue(result.errorMessage as string);
    } catch (error) {
      rejectWithValue(`user/changeMyPassword failed: ${error}`);
    }
  },
);
