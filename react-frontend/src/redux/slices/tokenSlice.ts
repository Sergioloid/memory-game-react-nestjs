import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface token {
    value: string,
    username: string
}

// Define the initial state using that type
const initialState: token = {
    value: "",
    username: ""
}
export const userToken = createSlice({
    name: "userToken",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        },
        setTokenUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { setToken, setTokenUsername } = userToken.actions

export default userToken.reducer