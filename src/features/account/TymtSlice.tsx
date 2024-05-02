import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { ITymt } from "../../types/accountTypes";
import { tymt_version } from "../../configs";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: ITymt = {
  version: tymt_version,
};

const loadTymt: () => ITymt = () => {
  const data = tymtStorage.get(`tymt`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadTymt(),
  status: "tymt",
  msg: "",
};

export const tymtSlice = createSlice({
  name: "tymt",
  initialState,
  reducers: {
    setTymt: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`tymt`, JSON.stringify(action.payload));
    },
  },
});

export const getTymt = (state: any) => state.tymt.data;
export const { setTymt } = tymtSlice.actions;

export default tymtSlice.reducer;
