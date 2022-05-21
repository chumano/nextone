import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAppStore } from "..";
import { ReceiveCallPayload, StartCallPayload } from "./callPayload";
import { CallState, CallStatus } from "./callState";

const initialState: CallState = {
    status: CallStatus.idle,
    isSender: true
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
            state.converstationId = payload.conversationId;
        },
        stopCall: (state) => {
            state.status = CallStatus.idle;
            state.converstationId = undefined;
        }
    },
})


export const callActions = callSlice.actions;
export const getCallState = (state: IAppStore) => state.call;
export default callSlice.reducer;