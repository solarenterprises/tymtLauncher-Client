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

const loadCustodial: () => custodialType = () => {
  const data = tymtStorage.get(`custodial`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`custodial`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`custodial`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`custodial`, JSON.stringify(action.payload));
    },
  },
});

export const getCustodial = (state: any) => state.custodial.data;
export const { setCustodial } = custodialSlice.actions;

export default custodialSlice.reducer;
