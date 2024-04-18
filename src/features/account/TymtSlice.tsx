import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { ITymt } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadTymt: () => ITymt = () => {
  const data = tymtStorage.get(`tymt_${tymt_version}`);
  if (data === null || data === "") {
    return {
      version: tymt_version,
    };
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
      tymtStorage.set(`tymt_${tymt_version}`, JSON.stringify(action.payload));
    },
  },
});

export const getTymt = (state: any) => state.tymt.data;
export const { setTymt } = tymtSlice.actions;

export default tymtSlice.reducer;
