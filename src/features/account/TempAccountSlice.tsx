import { createSlice } from "@reduxjs/toolkit";
import { IAccount } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: IAccount = {
  avatar: "",
  nickName: "",
  password: "",
  sxpAddress: "",
  mnemonic: "",
};

const loadTempAccount: () => IAccount = () => {
  const data = sessionStorage.getItem(`tempAccount`);
  if (!data || compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`tempAccount`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadTempAccount(),
  status: "tempAccount",
  msg: "",
};

export const tempAccountSlice = createSlice({
  name: "tempAccount",
  initialState,
  reducers: {
    setTempAccount: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`tempAccount`, JSON.stringify(state.data));
    },
  },
});

export const getTempAccount = (state: any) => state.tempAccount.data;
export const { setTempAccount } = tempAccountSlice.actions;

export default tempAccountSlice.reducer;
