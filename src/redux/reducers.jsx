import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
    name: "excel-data",
    initialState: {
        excelData: [],
        symbols: [],
        instruments: [],
        socketConnection: false,
        activeUser: 0,
        productTypes: [], 
        categoryTypes: {},
    },
    reducers: {
        setExcelData: (state, action) => {
            return { ...state, excelData: action.payload };
        },
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
        setProductTypes: (state, action) => {
            state.productTypes = action.payload;
        },
        setCategoryTypes: (state, action) => {
            const { typeId, data } = action.payload;
            state.categoryTypes[typeId] = data;
        }
    }
});
export const { setExcelData, setInstrumentDetails, setSymbolDetails, updateSocketConnection, updateActiveUser ,setProductTypes,setCategoryTypes} = dataSlice.actions;
export default dataSlice.reducer;