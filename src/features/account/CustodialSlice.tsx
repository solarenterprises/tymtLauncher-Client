import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { custodialType } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadCustodial: () => custodialType = () => {
  const data = tymtStorage.get(`custodial_${tymt_version}`);
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
  data: loadCustodial(),
  status: "custodial",
  msg: "",
};

export const custodialSlice = createSlice({
  name: "custodial",
  initialState,
  reducers: {
    setCustodial: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `custodial_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getCustodial = (state: any) => state.custodial.data;
export const { setCustodial } = custodialSlice.actions;

export default custodialSlice.reducer;
