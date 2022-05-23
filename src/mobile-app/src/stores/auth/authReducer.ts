import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AuthState } from "./authState";


const authInitialState :AuthState ={
    isLogined : false
}
const authSlice = createSlice({
    name: "auth",
    initialState: authInitialState,
    reducers: {
        login(state){
            state.isLogined = true;
        },
        logout(state){
            state.isLogined = false;
        }
    }
})

export const authActions = authSlice.actions;
export default authSlice.reducer;