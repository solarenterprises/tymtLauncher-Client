import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { processType } from "../../types/homeTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: processType = {
  progress: 0,
  inprogress: false,
  name: "",
};

const loadData: () => processType = () => {
  const data = tymtStorage.get(`installprocess`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
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
