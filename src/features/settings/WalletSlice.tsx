import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
const loadData = () => {
  const data = tymtStorage.get(`wallet_${tymt_version}`);
  if (data === null || data === "") {
    return {
      hidde: false,
      currency: "USD",
      status: "minimum",
      fee: "0.0",
    };
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
      tymtStorage.set(`wallet_${tymt_version}`, JSON.stringify(action.payload));
    },
  },
});

export const selectWallet = (state: any) => state.wallet.data;
export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
