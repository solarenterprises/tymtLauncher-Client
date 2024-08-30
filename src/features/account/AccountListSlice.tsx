import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IAccount, IAccountList } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: IAccountList = {
  list: [],
};

const loadAccountList: () => IAccountList = () => {
  const data = tymtStorage.get(`accountList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`accountList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadAccountList(),
  status: "accountList",
  msg: "",
};

export const accountListSlice = createSlice({
  name: "accountList",
  initialState,
  reducers: {
    setAccountList: (state, action) => {
      state.data.list = action.payload;
      tymtStorage.set(`accountList`, JSON.stringify(state.data));
    },
    addAccountList: (state, action) => {
      const account = action.payload as IAccount;
      if (!account) return;
      if (state.data.list.some((one) => one.sxpAddress === account.sxpAddress)) return;
      state.data.list = [...state.data.list, account];
      tymtStorage.set(`accountList`, JSON.stringify(state.data));
    },
    delAccountList: (state, action) => {
      const account = action.payload as IAccount;
      if (!account) return;
      state.data.list = state.data.list.filter((one) => one.sxpAddress !== account.sxpAddress);
      tymtStorage.set(`accountList`, JSON.stringify(state.data));
    },
  },
});

export const getAccountList = (state: any) => state.accountList.data;
export const { setAccountList, addAccountList, delAccountList } = accountListSlice.actions;

export default accountListSlice.reducer;
