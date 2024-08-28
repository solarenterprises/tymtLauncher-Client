import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPrice, IPriceList } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { resetPriceList } from "../../lib/helper/WalletHelper";
import { fetchPriceList } from "./PriceListApi";

const init: IPriceList = {
  list: resetPriceList(),
};

const loadPriceList: () => IPriceList = () => {
  const data = sessionStorage.getItem(`priceList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`priceList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadPriceList(),
  status: "priceList",
  msg: "",
};

export const fetchPriceListAsync = createAsyncThunk("priceList/fetchPriceListAsync", fetchPriceList);

export const priceListSlice = createSlice({
  name: "priceList",
  initialState,
  reducers: {
    setPriceList: (state, action) => {
      state.data.list = action.payload;
      sessionStorage.setItem(`priceList`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPriceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload as IPrice[];
        if (!data) return;
        state.data.list = data;
        sessionStorage.setItem(`priceList`, JSON.stringify(state.data));
        state.status = "priceList";
      });
  },
});

export const getPriceList = (state: any) => state.priceList.data;
export const { setPriceList } = priceListSlice.actions;

export default priceListSlice.reducer;
