import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface apiResponse {
    value: string
}

// Define the initial state using that type
const initialState: apiResponse = {
    value: ""
}
export const apiResponse = createSlice({
    name: "apiResponse",
    initialState,
    reducers: {
        setApiString: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { setApiString } = apiResponse.actions

export default apiResponse.reducer