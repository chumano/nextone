import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { EventInfo } from "../../models/event/Event.model";
import { UserStatus } from "../../models/user/UserStatus.model";


export interface IMapStore {
    loading?: boolean,
    events: EventInfo[],
    onlineUsers: UserStatus[], 

    selectedEventTypeCodes: string[]
}

const initState: IMapStore = {
    events :[],
    onlineUsers: [],
    selectedEventTypeCodes: []
}
export const mapSlice = createSlice({
    name: 'news',
    initialState: initState ,
    reducers: {
        setEvents: (state, action: PayloadAction<EventInfo[]>) =>{
            state.events = action.payload;
        },
        setOnlineUsers: (state, action: PayloadAction<UserStatus[]>) =>{
            state.onlineUsers = action.payload;
        },
    }
});

export const mapActions = mapSlice.actions;

export const mapStore = configureStore<IMapStore>({
    reducer: mapSlice.reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logger) as any,
})