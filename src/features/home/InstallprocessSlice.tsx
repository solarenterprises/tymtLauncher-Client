import { createSlice } from "@reduxjs/toolkit";
import { processType } from "../../types/homeTypes";

const init: processType = {
  progress: 0,
  inprogress: false,
  name: "",
};

const loadData: () => processType = () => {
  return init;
};

const initialState = {
  data: loadData(),
  status: "installprocess",
  msg: "",
};

const installprocessSlice = createSlice({
  name: "installprocess",
  initialState,
  reducers: {
    setProcess(state, action) {
      state.data = action.payload;
    },
  },
});

export const getProcess = (state: any) => state.installprocess.data;

export default installprocessSlice.reducer;

export const { setProcess } = installprocessSlice.actions;
