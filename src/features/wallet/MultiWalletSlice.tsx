import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAddressesFromMnemonic, refreshBalances } from "./MultiWalletApi";
import tymtStorage from "../../lib/Storage";
import { chains } from "../../consts/contracts";
import { multiWalletType } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const loadMultiWallet: () => multiWalletType = () => {
  const data = tymtStorage.get(`multiWallet`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`multiWallet`, JSON.stringify(chains));
    return chains;
  } else {
    if (compareJSONStructure(JSON.parse(data), chains)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`multiWallet`, JSON.stringify(chains));
      return chains;
    }
  }
};

const initialState = {
  data: loadMultiWallet(),
  status: "multiWallet",
  msg: "",
};

export const getAddressesFromMnemonicAsync = createAsyncThunk("multiWallet/getAddressesFromMnemonic", getAddressesFromMnemonic);

export const refreshBalancesAsync = createAsyncThunk("multiWallet/refreshBalances", refreshBalances);

export const multiWalletSlice = createSlice({
  name: "multiWallet",
  initialState,
  reducers: {
    setMultiWallet: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`multiWallet`, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddressesFromMnemonicAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAddressesFromMnemonicAsync.fulfilled, (state, action: PayloadAction<any>) => {
        // Update state based on the fetched addresses
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`multiWallet`, JSON.stringify(state.data));
        state.status = "succeeded";
      })
      .addCase(refreshBalancesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshBalancesAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action.payload;
        tymtStorage.set(`multiWallet`, JSON.stringify(state.data));
        state.status = "succeeded";
      })
      .addCase(refreshBalancesAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const getMultiWallet = (state: any) => state.multiWallet.data;
export const { setMultiWallet } = multiWalletSlice.actions;

export default multiWalletSlice.reducer;
