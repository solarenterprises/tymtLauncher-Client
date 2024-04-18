import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { custodialType } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadTempCustodial: () => custodialType = () => {
  const data = tymtStorage.get(`tempCustodial_${tymt_version}`);
  if (data === null || data === "") {
    return {
      email: "",
      avatar: "",
      nickname: "",
      password: "",
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadTempCustodial(),
  status: "tempCustodial",
  msg: "",
};

export const tempCustodialSlice = createSlice({
  name: "tempCustodial",
  initialState,
  reducers: {
    setTempCustodial: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `tempCustodial_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getTempCustodial = (state: any) => state.tempCustodial.data;
export const { setTempCustodial } = tempCustodialSlice.actions;

export default tempCustodialSlice.reducer;
