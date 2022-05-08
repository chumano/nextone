import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAppStore } from ".";

export enum CallStatus {
    idle,
    calling
}

export interface CallState {
    status : CallStatus
    isSender: boolean
}

const initialState: CallState = {
    status: CallStatus.idle,
    isSender: true
}

export const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        receiveCall: (state) => {
            state.status = CallStatus.calling;
            state.isSender = false;
        },
        toggleCall: (state) => {
            if(state.status==CallStatus.calling){
                state.status = CallStatus.idle;
            }else{
                state.status = CallStatus.calling;
                state.isSender = true;
            }
        },
        stopCall: (state) => {
            state.status = CallStatus.idle;
        }
    },
})


export const callActions = callSlice.actions;
export const getCallState = (state: IAppStore) => state.call;
export default callSlice.reducer;