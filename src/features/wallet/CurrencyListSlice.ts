import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ICurrency, ICurrencyList } from "../../types/walletTypes";
import { supportCurrency } from "../../consts/SupportCurrency";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { fetchCurrencyList } from "./CurrencyListApi";

const init: ICurrencyList = {
  list: supportCurrency?.map((one) => {
    const data: ICurrency = {
      name: one?.name,
      reserve: 1.0,
    };
    return data;
  }),
};

const loadCurrencyList: () => ICurrencyList = () => {
  const data = sessionStorage.getItem(`currencyList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`currencyList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadCurrencyList(),
  status: "currencyList",
  msg: "",
};

export const fetchCurrencyListAsync = createAsyncThunk("currency/fetchCurrencyAsync", fetchCurrencyList);

export const currencyListSlice = createSlice({
  name: "currencyList",
  initialState,
  reducers: {
    setCurrencyList: (state, action) => {
      state.data.list = action.payload;
      sessionStorage.setItem(`currencyList`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrencyListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload as ICurrency[];
        if (!data) return;
        state.data.list = data;
        sessionStorage.setItem(`currencyList`, JSON.stringify(state.data));
        state.status = "currencyList";
      });
  },
});

export const getCurrencyList = (state: any) => state.currencyList.data;
export const { setCurrencyList } = currencyListSlice.actions;

export default currencyListSlice.reducer;
