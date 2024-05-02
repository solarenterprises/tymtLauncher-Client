import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { nonCustodialType } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: nonCustodialType = {
  mnemonic: "",
  mnemonicLength: 12,
  avatar: "",
  nickname: "",
  password: "",
};

const loadNonCustodial: () => nonCustodialType = () => {
  const data = tymtStorage.get(`nonCustodial`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
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
      tymtStorage.set(`nonCustodial`, JSON.stringify(action.payload));
    },
  },
});

export const getNonCustodial = (state: any) => state.nonCustodial.data;
export const { setNonCustodial } = nonCustodialSlice.actions;

export default nonCustodialSlice.reducer;
