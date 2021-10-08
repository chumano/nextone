import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { UserService } from "../../services";
import { IUser } from "../../utils";

type UserState = {
    totalUser: number,
    users : IUser[]
} 
const initialState : UserState  = {
    totalUser :0,
    users : []
} 

export interface IUserStore{
    userState :UserState
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        getAll: (state, action) => {
            state.totalUser = action.payload.total;
            state.users = action.payload.items;
        }
    },
})

const userReducer = userSlice.reducer;

export const { getAll } = userSlice.actions;
export const getUsers = (state: IUserStore) => state.userState;


export const fetchUsers = (filters?: any) => async (dispatch : Dispatch<any>) => {
    //dispatch(usersLoading())
    const response = await UserService.findBy(filters);
    dispatch(getAll(response.data))
  }

export const userStore = configureStore<IUserStore>({
    reducer: {
        userState : userReducer
    },
})