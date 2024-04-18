import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getTempAddressesFromMnemonic } from "./TempMultiWalletApi";
import tymtStorage from "../../lib/Storage";
import { chains } from "../../consts/contracts";

import { multiWalletType } from "../../types/walletTypes";
import { tymt_version } from "../../configs";

const loadTempMultiWallet: () => multiWalletType = () => {
  const data = tymtStorage.get(`tempMultiWallet_${tymt_version}`);
  if (data === null || data === "") {
    return chains as multiWalletType;
  } else {
    return JSON.parse(data) as multiWalletType;
  }
};
const initialState = {
  data: loadTempMultiWallet(),
  status: "tempMultiWallet",
  msg: "",
};

export const getTempAddressesFromMnemonicAsync = createAsyncThunk(
  "tempMultiWallet/getTempAddressesFromMnemonic",
  getTempAddressesFromMnemonic
);

export const tempMultiWalletSlice = createSlice({
  name: "tempMultiWallet",
  initialState,
  reducers: {
    setTempMultiWallet: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `tempMultiWallet_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTempAddressesFromMnemonicAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getTempAddressesFromMnemonicAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.data = { ...state.data, ...action.payload };
          tymtStorage.set(
            `tempMultiWallet_${tymt_version}`,
            JSON.stringify(state.data)
          );
          state.status = "succeeded";
        }
      )
      .addCase(getTempAddressesFromMnemonicAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const getTempMultiWallet = (state: any) => state.tempMultiWallet.data;
export const { setTempMultiWallet } = tempMultiWalletSlice.actions;

export default tempMultiWalletSlice.reducer;
