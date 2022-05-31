import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";

export interface INewsStore {
    view: 'main' | 'new' | 'update'
    loading?: boolean,
    newsList: any[],
    filters?: {
        textSearch?: string,
        publishState: 0 | 1 | 2,
        page: number,
        pageSize: number
    }
}

const initState: INewsStore = {
    view: 'main',
    newsList: []
}
export const newsSlice = createSlice({
    name: 'news',
    initialState: initState as any,
    reducers: {
        setNewsList: (state, action: PayloadAction<any[]>) => {
            state.newsList = action.payload;
        },
        setView: (state, action: PayloadAction<'main' | 'new' | 'update'>) => {
            state.view = action.payload;
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