import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        message: "Initial message"
    },
    reducers: {
        setMessage(state, action: PayloadAction<string>) {
            state.message = action.payload
        }
    }
})

export const { setMessage } = authSlice.actions
export default authSlice.reducer