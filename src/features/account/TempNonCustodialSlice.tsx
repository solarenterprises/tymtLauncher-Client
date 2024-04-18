import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { nonCustodialType } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadTempNonCustodial: () => nonCustodialType = () => {
  const data = tymtStorage.get(`tempNonCustodial_${tymt_version}`);
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
  data: loadTempNonCustodial(),
  status: "tempNonCustodial",
  msg: "",
};

export const tempNonCustodialSlice = createSlice({
  name: "tempNonCustodial",
  initialState,
  reducers: {
    setTempNonCustodial: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `tempNonCustodial_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getTempNonCustodial = (state: any) => state.tempNonCustodial.data;
export const { setTempNonCustodial } = tempNonCustodialSlice.actions;

export default tempNonCustodialSlice.reducer;
