import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CallState } from "./callState";


const callInitialState :CallState ={
    isCalling : false
}
const callSlice = createSlice({
    name: "call",
    initialState: callInitialState,
    reducers: {
        call(state){
            state.isCalling = true;
        },
        stopCall(state){
            state.isCalling = false;
        }
    }
})

export const callActions = callSlice.actions;
export default callSlice.reducer;