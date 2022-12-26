import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import React, { ReactNode } from 'react'
import {
    Provider,
    createStoreHook,
    createDispatchHook,
    createSelectorHook,
    ReactReduxContextValue,
} from 'react-redux'

export interface UserActivity{
    id: string,
    userId: string,
    userName: string,
    action:string,
    system?:string,
    createdDate: string
}
export interface UserActivityFilter{
    textSearch?: string,
    page?: number,
    pageSize?: number,
}
export interface IUserActivityStore {
    loading?: boolean,
    count: number,
    userActivityList: UserActivity[],
    filters?: UserActivityFilter
}

const initState: IUserActivityStore = {
    count: 0,
    userActivityList: []
}
export const userActivitySlice = createSlice({
    name: 'news',
    initialState: initState ,
    reducers: {
        setUserActivityList: (state, action: PayloadAction<UserActivity[]>) => {
            state.userActivityList = action.payload;
        },
        setUserActivityCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
       
        setPagination: (state, action: PayloadAction<{page:number, pageSize:number}>) =>{
            state.filters = {
                ...state.filters,
                page: action.payload.page,
                pageSize: action.payload.pageSize
            }
        },
        setFilter: (state, action: PayloadAction<UserActivityFilter>) =>{
            state.filters = action.payload
        },
        
        deleteUserActivity: (state, action: PayloadAction<string>) =>{
            state.userActivityList = state.userActivityList.filter(o=>{
                return o.id !== action.payload
            })
            if(state.userActivityList.length === 0 
                && state.filters && state.filters.page!==undefined 
                && state.filters.page >1){
                state.filters.page = state.filters.page-1;
            }
        }
    }
});

export const userActivityActions = userActivitySlice.actions;


export const newsStore = configureStore<IUserActivityStore>({
    reducer: userActivitySlice.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })as any,
    //.concat(logger) 
})

export interface IUserActivityContext 
    extends ReactReduxContextValue<IUserActivityStore, PayloadAction<any>> {
}

const UserActivityContext = React.createContext<IUserActivityContext>({} as any);

//hooks for context
export const useUserActivityStore = createStoreHook(UserActivityContext)
export const useUserActivityDispatch = createDispatchHook(UserActivityContext)
export const useUserActivitySelector = createSelectorHook(UserActivityContext)

export const UserActivityContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <Provider context={UserActivityContext as any} store={newsStore}>
            {children}
        </Provider>
    )
}

