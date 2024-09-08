import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IAccount } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: IAccount = {
  uid: "",
  avatar: "",
  nickName: "",
  password: "",
  sxpAddress: "",
  mnemonic: "",
  rsaPubKey: "",
};

const loadAccount: () => IAccount = () => {
  const data = tymtStorage.get(`account`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`account`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadAccount(),
  status: "account",
  msg: "",
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`account`, JSON.stringify(state.data));
    },
  },
});

export const getAccount = (state: any) => state.account.data;
export const { setAccount } = accountSlice.actions;

export default accountSlice.reducer;
