import { configureStore, createSlice } from "@reduxjs/toolkit";
import { createContext, Dispatch } from "react";
import { UserService } from "../../services";
import { IUser } from "../../utils";

export const UserContext =  createContext<any>({});

type UserState = {
    loading: 'pending' | 'idle',
    totalUser: number,
    users : IUser[]
} 
const initialState : UserState  = {
    loading: 'idle',
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
        usersLoading(state) {
            // Use a "state machine" approach for loading state instead of booleans
            if (state.loading === 'idle') {
              state.loading = 'pending'
            }
          },
        usersLoaded: (state, action) => {
            state.loading = 'idle';
            state.totalUser = action.payload.total;
            state.users = action.payload.items;
        }
    },
})

export const getUsers = (state: IUserStore) => state.userState;

const { usersLoading, usersLoaded } = userSlice.actions;
export const fetchUsers = (filters?: any) => async (dispatch : Dispatch<any>) => {
    dispatch(usersLoading());
    const response = await UserService.findBy(filters);
    dispatch(usersLoaded(response.data))
  }


const userReducer = userSlice.reducer;
export const userStore = configureStore<IUserStore>({
    reducer: {
        userState : userReducer
    },
})


