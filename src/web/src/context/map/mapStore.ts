import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { EventInfo } from "../../models/event/Event.model";
import { UserStatus } from "../../models/user/UserStatus.model";


export interface IMapStore {
    loading?: boolean,
    events: EventInfo[],
    onlineUsers: UserStatus[], 

    selectedEventTypeCodes?: string[],
    selectedEvent?: EventInfo,
    selectedUser?: UserStatus 
}

const initState: IMapStore = {
    events :[],
    onlineUsers: []
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
        selectEvent: (state, action: PayloadAction<EventInfo>) =>{
            state.selectedEvent = action.payload;
            state.selectedUser = undefined;
        },
        selectUser: (state, action: PayloadAction<UserStatus>) =>{
            state.selectedUser = action.payload;
            state.selectedEvent = undefined;
        },
        updateSelectedEventTypes: (state, action: PayloadAction<string[]>) =>{
            state.selectedEventTypeCodes = action.payload;
        },
        clearSelectedObjects: (state, action: PayloadAction) =>{
            state.selectedUser = undefined;
            state.selectedEvent = undefined;
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