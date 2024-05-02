import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { walletType } from "../../types/settingTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: walletType = {
  refreshed: false,
  hidde: false,
  currency: "USD",
  status: "minimum",
  fee: "0.0",
};

const loadData: () => walletType = () => {
  const data = tymtStorage.get(`wallet`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadData(),
  status: "wallet",
  msg: "",
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`wallet`, JSON.stringify(action.payload));
    },
  },
});

export const selectWallet = (state: any) => state.wallet.data;
export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
