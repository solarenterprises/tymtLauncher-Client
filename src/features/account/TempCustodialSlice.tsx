import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { custodialType } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: custodialType = {
  email: "",
  avatar: "",
  nickname: "",
  password: "",
};

const loadTempCustodial: () => custodialType = () => {
  const data = tymtStorage.get(`tempCustodial`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`tempCustodial`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`tempCustodial`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`tempCustodial`, JSON.stringify(action.payload));
    },
  },
});

export const getTempCustodial = (state: any) => state.tempCustodial.data;
export const { setTempCustodial } = tempCustodialSlice.actions;

export default tempCustodialSlice.reducer;
