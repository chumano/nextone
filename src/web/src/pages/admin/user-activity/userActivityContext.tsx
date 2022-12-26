import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import React, { ReactNode } from 'react'
import {
    Provider,
    createStoreHook,
    createDispatchHook,
    createSelectorHook,
    ReactReduxContextValue,
} from 'react-redux'

export interface News{
    id: string
}
export interface NewsFilter{
    page: number,
    pageSize: number,
}
export interface INewsStore {
    view: 'main' | 'new' | 'update'
    loading?: boolean,
    count: number,
    newsList: News[],
    filters?: NewsFilter,
    selectedNewsId?: string
}

const initState: INewsStore = {
    view: 'main',
    count: 0,
    newsList: []
}
export const newsSlice = createSlice({
    name: 'news',
    initialState: initState ,
    reducers: {
        setNewsList: (state, action: PayloadAction<News[]>) => {
            state.newsList = action.payload;
        },
        setNewsCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
        setView: (state, action: PayloadAction<'main' | 'new' | 'update'>) => {
            state.view = action.payload;
        },
        viewNews: (state, action: PayloadAction<string>)=>{
            state.selectedNewsId = action.payload;
        },
        setPagination: (state, action: PayloadAction<{page:number, pageSize:number}>) =>{
            state.filters = {
                ...state.filters,
                page: action.payload.page,
                pageSize: action.payload.pageSize
            }
        },
        setFilter: (state, action: PayloadAction<NewsFilter>) =>{
            state.filters = action.payload
        },
        setPublished: (state, action: PayloadAction<{id:string, isPublished:boolean}>) =>{
            state.newsList = state.newsList.map(o=>{
                if(o.id === action.payload.id){
                    return {
                        ...o,
                        isPublished: action.payload.isPublished
                    }
                }
                return o;
            })
        },
        deleteNews: (state, action: PayloadAction<string>) =>{
            state.newsList = state.newsList.filter(o=>{
                return o.id !== action.payload
            })
            if(state.newsList.length === 0 
                && state.filters && state.filters.page!==undefined 
                && state.filters.page >1){
                state.filters.page = state.filters.page-1;
            }
        }
    }
});

export const newsActions = newsSlice.actions;

export const getNewsList = (store: INewsStore) => store.newsList;

export const newsStore = configureStore<INewsStore>({
    reducer: newsSlice.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })as any,
    //.concat(logger) 
})

export interface INewsContext 
    extends ReactReduxContextValue<INewsStore, PayloadAction<any>> {
}

const NewsContext = React.createContext<INewsContext>({} as any);

//hooks for context
export const useNewsStore = createStoreHook(NewsContext)
export const useNewsDispatch = createDispatchHook(NewsContext)
export const useNewsSelector = createSelectorHook(NewsContext)

export const NewsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    return (
        <Provider context={NewsContext as any} store={newsStore}>
            {children}
        </Provider>
    )
}

