import { createSlice } from "@reduxjs/toolkit";

const jewellerySlice = createSlice({
    name: "jewellery",
    initialState: {
        productTypes: [], 
        categoryTypes: [],
        subCategoryTypes :[]
    },
    reducers: {
        setProductTypes: (state, action) => {
            state.productTypes = action.payload;
        },
        setCategoryTypes: (state, action) => {
            // const { typeId, data } = action.payload;
            state.categoryTypes = action?.payload;
        },
        setSubCategoryTypes: (state, action) => {
            // const { typeId, data } = action.payload;
            state.subCategoryTypes = action.payload;
        }
    },
});

export const { setProductTypes,setCategoryTypes,setSubCategoryTypes } = jewellerySlice.actions;
export default jewellerySlice.reducer;
