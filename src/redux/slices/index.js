import { combineReducers } from "@reduxjs/toolkit";

import excelReducer from "./excelSlice";
import socketReducer from "./socketSlice";
import jewelleryReducer from "./jewellerySlice";

const rootReducer = combineReducers({
  excel: excelReducer,
  socket: socketReducer,
  jewellery: jewelleryReducer,
});

export default rootReducer;
