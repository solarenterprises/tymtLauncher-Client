import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { nonCustodialType } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadNonCustodial: () => nonCustodialType = () => {
  const data = tymtStorage.get(`nonCustodial_${tymt_version}`);
  if (data === null || data === "") {
    return {
      mnemonic: "",
      mnemonicLength: 12,
      avatar: "",
      nickname: "",
      password: "",
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadNonCustodial(),
  status: "nonCustodial",
  msg: "",
};

export const nonCustodialSlice = createSlice({
  name: "nonCustodial",
  initialState,
  reducers: {
    setNonCustodial: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `nonCustodial_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getNonCustodial = (state: any) => state.nonCustodial.data;
export const { setNonCustodial } = nonCustodialSlice.actions;

export default nonCustodialSlice.reducer;
