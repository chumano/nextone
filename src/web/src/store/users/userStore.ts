import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { UserService } from "../../services";
import { IUser } from "../../utils";

const initialState : {
    users: IUser[]
} = {
    users : []
} 

export interface IUserStore{
    userState : {
        users : IUser[]
    } 
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getAll: (state, action) => {
            state.users = action.payload;
        }
    },
})

const userReducer = userSlice.reducer;

export const { getAll } = userSlice.actions;
export const getUsers = (state: IUserStore) => state.userState;


export const fetchUsers = () => async (dispatch : Dispatch<any>) => {
    //dispatch(usersLoading())
    const response = await UserService.getAll();
    dispatch(getAll(response.data))
  }

export const userStore = configureStore<IUserStore>({
    reducer: {
        userState : userReducer
    },
})