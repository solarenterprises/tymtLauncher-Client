import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IWallet, IWalletList } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: IWalletList = {
  list: [],
};

const loadWalletList: () => IWalletList = () => {
  const data = tymtStorage.get(`walletList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`walletList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadWalletList(),
  status: "walletList",
  msg: "",
};

export const walletListsSlice = createSlice({
  name: "walletList",
  initialState,
  reducers: {
    setWalletList: (state, action) => {
      state.data.list = action.payload;
      tymtStorage.set(`walletList`, JSON.stringify(state.data));
    },
    addWalletList: (state, action) => {
      const newWallet = action?.payload as IWallet;
      if (!newWallet) return;
      if (state.data.list.some((one) => one?.solar === newWallet?.solar)) return;
      state.data.list = [...state.data.list, newWallet];
      tymtStorage.set(`walletList`, JSON.stringify(state.data));
    },
    delWalletList: (state, action) => {
      const newWallet = action?.payload as IWallet;
      if (!newWallet) return;
      state.data.list = state.data.list.filter((one) => one?.solar !== newWallet?.solar);
      tymtStorage.set(`walletList`, JSON.stringify(state.data));
    },
  },
});

export const getWalletList = (state: any) => state.walletList.data;
export const { setWalletList, addWalletList, delWalletList } = walletListsSlice.actions;

export default walletListsSlice.reducer;
