import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { NewsFilter } from "../../models/dtos/NewsDTOs";
import { News } from "../../models/news/News";


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
    }).concat(logger) as any,
})