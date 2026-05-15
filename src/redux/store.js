import { configureStore } from "@reduxjs/toolkit";
import dataReducer from './reducers';
import rootReducer from "./slices";

export const store = configureStore({
    reducer: rootReducer
});