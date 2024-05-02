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

const loadTempNonCustodial: () => nonCustodialType = () => {
  const data = tymtStorage.get(`tempNonCustodial`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
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
      tymtStorage.set(`tempNonCustodial`, JSON.stringify(action.payload));
    },
  },
});

export const getTempNonCustodial = (state: any) => state.tempNonCustodial.data;
export const { setTempNonCustodial } = tempNonCustodialSlice.actions;

export default tempNonCustodialSlice.reducer;
