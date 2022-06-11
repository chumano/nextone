import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";


export interface IMapStore {
    loading?: boolean,
}

const initState: IMapStore = {
}
export const mapSlice = createSlice({
    name: 'news',
    initialState: initState ,
    reducers: {
        
    }
});

export const newsActions = mapSlice.actions;

export const mapStore = configureStore<IMapStore>({
    reducer: mapSlice.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logger) as any,
})