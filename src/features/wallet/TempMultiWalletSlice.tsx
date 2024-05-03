import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getTempAddressesFromMnemonic } from "./TempMultiWalletApi";
import tymtStorage from "../../lib/Storage";
import { chains } from "../../consts/contracts";
import { multiWalletType } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: multiWalletType = chains;

const loadTempMultiWallet: () => multiWalletType = () => {
  const data = tymtStorage.get(`tempMultiWallet`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`tempMultiWallet`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`tempMultiWallet`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`tempMultiWallet`, JSON.stringify(action.payload));
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
          tymtStorage.set(`tempMultiWallet`, JSON.stringify(state.data));
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
