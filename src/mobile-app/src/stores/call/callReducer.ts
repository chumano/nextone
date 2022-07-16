import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CallMessageData } from "../../types/CallMessageData";
import { CallState } from "./callState";


const callInitialState :CallState ={
    isCalling : false
}
const callSlice = createSlice({
    name: "call",
    initialState: callInitialState,
    reducers: {
        call: (state, action: PayloadAction<{ 
            callId?: string, 
            callInfo: CallMessageData
        } >) => {
            const {callId, callInfo} = action.payload;
            state.isCalling = true;
            state.callInfo = callInfo;
        },
        stopCall(state){
            state.isCalling = false;
        }
    }
})

export const callActions = callSlice.actions;
export default callSlice.reducer;