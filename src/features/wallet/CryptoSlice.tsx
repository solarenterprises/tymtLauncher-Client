import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { sendCoin, walletTransaction } from "./CryptoApi";
import tymtStorage from "../../lib/Storage";

const initialState = {
  transactions: [],
  chain: "",
  pending: false,
  msg: "",
};

export interface INotification {
  status: "failed" | "success" | "warning" | "alert" | "message";
  title: string;
  message: string;
}

export const sendCoinAsync = createAsyncThunk("coin/send", sendCoin);
export const getTransactionsAsync = createAsyncThunk(
  "wallet/transaction",
  walletTransaction
);

export const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setChain: (state, action) => {
      state.chain = action.payload;
    },
    setTransasctions: (state) => {
      state.transactions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendCoinAsync.pending, (state) => {
        state.pending = true;
      })
      .addCase(sendCoinAsync.fulfilled, (state) => {
        state.pending = false;
        // state.contactdata = action.payload.data;
        state.msg = "We will contat you as soon as possible";
      })
      .addCase(getTransactionsAsync.pending, (state) => {
        state.pending = true;
      })
      .addCase(getTransactionsAsync.fulfilled, (state, action) => {
        state.pending = false;
        state.transactions = [...state.transactions, ...action.payload];
        if (action.payload.length === 0) {
          tymtStorage.set(`loadMoreAvailable`, false);
        }
        state.msg = "We will contact you as soon as possible";
      });
  },
});

export const { setTransasctions } = cryptoSlice.actions;

export const selectTrasaction = (state) => state.crypto.transactions;
export const selectPending = (state) => state.crypto.pending;

export default cryptoSlice.reducer;
