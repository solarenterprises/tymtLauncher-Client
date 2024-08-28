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
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`walletSetting`, JSON.stringify(init));
    return init;
  }

  return JSON.parse(data);
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
