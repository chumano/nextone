import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import React, { ReactNode } from 'react'
import {
    Provider,
    createStoreHook,
    createDispatchHook,
    createSelectorHook,
    ReactReduxContextValue,
} from 'react-redux'

export interface Backup{
    name: string,
    createdDate: string,
    size: number
}
export interface BackupSchedule{
    backupIntervalInDays: number,
    keepNumber: number
}
export interface BackupFilter{
    textSearch?: string,
    page?: number,
    pageSize?: number,
}
export interface IBackupStore {
    loading?: boolean,
    count: number,
    backupList: Backup[],
    filters?: BackupFilter,
    backupSchedule?: BackupSchedule
}

const initState: IBackupStore = {
    count: 0,
    backupList: []
}
export const backupSlice = createSlice({
    name: 'news',
    initialState: initState ,
    reducers: {
        setBackupList: (state, action: PayloadAction<Backup[]>) => {
            state.backupList = action.payload;
        },
        setBackupCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
       
        setPagination: (state, action: PayloadAction<{page:number, pageSize:number}>) =>{
            state.filters = {
                ...state.filters,
                page: action.payload.page,
                pageSize: action.payload.pageSize
            }
        },
        setFilter: (state, action: PayloadAction<BackupFilter>) =>{
            state.filters = action.payload
        },

        setBackupSchedule: (state, action: PayloadAction<BackupSchedule>) => {
            state.backupSchedule = action.payload;
        },
        
        deleteBackup: (state, action: PayloadAction<string>) =>{
            state.backupList = state.backupList.filter(o=>{
                return o.name !== action.payload
            })
            if(state.backupList.length === 0 
                && state.filters && state.filters.page!==undefined 
                && state.filters.page >1){
                state.filters.page = state.filters.page-1;
            }
        }
    }
});

export const backupActions = backupSlice.actions;


export const backupStore = configureStore<IBackupStore>({
    reducer: backupSlice.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })as any,
    //.concat(logger) 
})

export interface IBackupContext 
    extends ReactReduxContextValue<IBackupStore, PayloadAction<any>> {
}

const BackupContext = React.createContext<IBackupContext>({} as any);

//hooks for context
export const useBackupStore = createStoreHook(BackupContext)
export const useBackupDispatch = createDispatchHook(BackupContext)
export const useBackupSelector = createSelectorHook(BackupContext)

export const BackupContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <Provider context={BackupContext as any} store={backupStore}>
            {children}
        </Provider>
    )
}

