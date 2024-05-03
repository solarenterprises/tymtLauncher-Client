import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { ICurrency } from "../../types/walletTypes";
import { currency } from "../../consts/currency";
import { refreshCurrency } from "./CurrencyApi";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

export const refreshCurrencyAsync = createAsyncThunk(
  "currency/refreshCurrency",
  refreshCurrency
);

const init: ICurrency = currency;

const loadCurrency: () => ICurrency = () => {
  const data = tymtStorage.get(`currency`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`currency`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`currency`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`currency`, JSON.stringify(action.payload));
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
          tymtStorage.set(`currency`, JSON.stringify(state.data));
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
