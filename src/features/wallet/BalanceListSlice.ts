import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBalance, IBalanceList } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { resetBalanceList } from "../../lib/helper/WalletHelper";
import { fetchBalanceList, fetchChainBalance } from "./BalanceListApi";

const init: IBalanceList = {
  list: resetBalanceList(),
};

const loadBalanceList: () => IBalanceList = () => {
  const data = sessionStorage.getItem(`balanceList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`balanceList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadBalanceList(),
  status: "balanceList",
  msg: "",
};

export const fetchBalanceListAsync = createAsyncThunk("balanceList/fetchBalanceListAsync", fetchBalanceList);
export const fetchChainBalanceAsync = createAsyncThunk("balanceList/fetchChainBalanceAsync", fetchChainBalance);

export const balanceListSlice = createSlice({
  name: "balanceList",
  initialState,
  reducers: {
    setBalanceList: (state, action) => {
      state.data.list = action.payload;
      sessionStorage.setItem(`balanceList`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBalanceListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload as IBalance[];
        if (!data) return;
        const rest = state.data.list.filter((one) => !data?.some((item) => item?.symbol === one?.symbol));
        state.data.list = [...rest, ...data];
        sessionStorage.setItem(`balanceList`, JSON.stringify(state.data));
        state.status = "balanceList";
      })
      .addCase(fetchChainBalanceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChainBalanceAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const data = action.payload as IBalance[];
        if (!data) return;
        const rest = state.data.list.filter((one) => !data?.some((item) => item?.symbol === one?.symbol));
        state.data.list = [...rest, ...data];
        sessionStorage.setItem(`balanceList`, JSON.stringify(state.data));
        state.status = "balanceList";
      });
  },
});

export const getBalanceList = (state: any) => state.balanceList.data;
export const { setBalanceList } = balanceListSlice.actions;

export default balanceListSlice.reducer;
