import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAppStore } from "..";
import { DeviceSettings, PrepareCallPlayload, ReceiveCallPayload, StartCallPayload } from "./callPayload";
import { CallState, CallStatus } from "./callState";

const initialState: CallState = {
    status: CallStatus.idle,
    isSender: true,
    callType: 'voice',
    modals : {}
}

export const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        receiveCall: (state, action: PayloadAction<ReceiveCallPayload>) => {
            const {payload} = action;
            state.status = CallStatus.calling;
            state.isSender = false;
            state.converstationId = payload.conversationId;
        },
        startCall: (state, action: PayloadAction<StartCallPayload>) => {
            const {payload} = action;
            state.status = CallStatus.calling;
            state.isSender = true;
            state.callType = payload.callType;
            state.converstationId = payload.conversationId;
        },
        stopCall: (state) => {
            state.status = CallStatus.idle;
            state.converstationId = undefined;
        },
        prepareCall: (state, action: PayloadAction<PrepareCallPlayload>) =>{
            const {payload} = action;
            state.status = CallStatus.settings;
            state.callType = payload.callType;
            state.converstationId = payload.conversationId;
        },
        setDeviceSettings: (state, action: PayloadAction<DeviceSettings>) =>{
            state.deviceSettings = action.payload;
            if(state.status == CallStatus.settings){
                state.status = CallStatus.calling;
            }
        },

        showModal: (state, action: PayloadAction<{ modal: string, visible: boolean, data?: any }>) => {
            const { modal, visible, data } = action.payload
            state.modals[modal] = {
                ...state.modals[modal],
                visible,
                data: visible? data: undefined
            };
        }
    },
})


export const callActions = callSlice.actions;
export const getCallState = (state: IAppStore) => state.call;
export default callSlice.reducer;