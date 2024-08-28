import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IWalletSetting } from "../../types/settingTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: IWalletSetting = {
  refreshed: false,
  hidde: false,
  currency: "USD",
  status: "minimum",
  fee: "0.0183",
};

const loadWalletSetting: () => IWalletSetting = () => {
  const data = tymtStorage.get(`walletSetting`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`wallet`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`wallet`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadWalletSetting(),
  status: "walletSetting",
  msg: "",
};

export const walletSettingSlice = createSlice({
  name: "walletSetting",
  initialState,
  reducers: {
    setWalletSetting: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`walletSetting`, JSON.stringify(state.data));
    },
  },
});

export const getWalletSetting = (state: any) => state.walletSetting.data;
export const { setWalletSetting } = walletSettingSlice.actions;

export default walletSettingSlice.reducer;
