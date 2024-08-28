import { createSlice } from "@reduxjs/toolkit";
import { ICurrentCurrency } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: ICurrentCurrency = {
  currency: "USD",
};

const loadCurrentCurrency: () => ICurrentCurrency = () => {
  const data = sessionStorage.getItem(`currentCurrency`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`currentCurrency`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadCurrentCurrency(),
  status: "currentCurrency",
  msg: "",
};

export const currentCurrencySlice = createSlice({
  name: "currentCurrency",
  initialState,
  reducers: {
    setCurrentCurrency: (state, action) => {
      state.data.currency = action.payload;
      sessionStorage.setItem(`currentCurrency`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentCurrency = (state: any) => state.currentCurrency.data;
export const { setCurrentCurrency } = currentCurrencySlice.actions;

export default currentCurrencySlice.reducer;
