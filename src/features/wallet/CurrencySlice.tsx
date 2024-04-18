import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { ICurrency } from "../../types/walletTypes";
import { tymt_version } from "../../configs";
import { currency } from "../../consts/currency";
import { refreshCurrency } from "./CurrencyApi";

export const refreshCurrencyAsync = createAsyncThunk(
  "currency/refreshCurrency",
  refreshCurrency
);

const loadCurrency: () => ICurrency = () => {
  const data = tymtStorage.get(`currency_${tymt_version}`);
  if (data === null || data === "") {
    return currency;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadCurrency(),
  status: "currency",
  msg: "",
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `currency_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshCurrencyAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        refreshCurrencyAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.data = { ...state.data, data: action.payload };
          tymtStorage.set(
            `currency_${tymt_version}`,
            JSON.stringify(state.data)
          );
          state.status = "succeeded";
        }
      )
      .addCase(refreshCurrencyAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const getCurrency = (state: any) => state.currency.data;
export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;
