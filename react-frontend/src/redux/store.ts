import { configureStore } from "@reduxjs/toolkit"
import tokenReducer from "./slices/tokenSlice"
import apiResponseReducer from "./slices/apiResponseSlice"

export const store = configureStore({
    reducer: {
        token: tokenReducer,
        apiResponse: apiResponseReducer,
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch