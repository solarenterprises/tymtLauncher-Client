import { createSlice } from "@reduxjs/toolkit";
import { IWallet } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: IWallet = {
  arbitrum: "",
  avalanche: "",
  bitcoin: "",
  binance: "",
  ethereum: "",
  optimism: "",
  polygon: "",
  solana: "",
  solar: "",
};

const loadTempWallet: () => IWallet = () => {
  const data = sessionStorage.getItem(`tempWallet`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`tempWallet`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadTempWallet(),
  status: "tempWallet",
  msg: "",
};

export const tempWalletSlice = createSlice({
  name: "tempWallet",
  initialState,
  reducers: {
    setTempWallet: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`tempWallet`, JSON.stringify(state.data));
    },
  },
});

export const getTempWallet = (state: any) => state.tempWallet.data;
export const { setTempWallet } = tempWalletSlice.actions;

export default tempWalletSlice.reducer;
