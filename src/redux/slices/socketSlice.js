import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        symbols: [],
        instruments: [],
        socketConnection: false,
        activeUser: 0,
    },
    reducers: {
        setSymbolDetails: (state, action) => {
            return { ...state, symbols: action.payload };
        },
        setInstrumentDetails: (state, action) => {
            return { ...state, instruments: action.payload };
        },
        updateSocketConnection: (state, action) => {
            return { ...state, socketConnection: action.payload };
        },
        updateActiveUser: (state, action) => {
            return { ...state, activeUser: action.payload };
        },
        clearSocket: (state) => {
            return {
                symbols: [],
                instruments: [],
                socketConnection: false,
                activeUser: 0,
            };
        },
    },

});

export const { setInstrumentDetails, setSymbolDetails, updateSocketConnection, updateActiveUser, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
