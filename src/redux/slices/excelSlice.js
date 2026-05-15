import { createSlice } from "@reduxjs/toolkit";

const excelSlice = createSlice({
    name: "excel",
    initialState: {
        excelData: [],
    },
    reducers: {
        setExcelData: (state, action) => {
            state.excelData = action.payload;
        },
    },
});

export const { setExcelData } = excelSlice.actions;
export default excelSlice.reducer;
