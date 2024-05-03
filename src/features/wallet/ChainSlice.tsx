import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { setChain } from "./ChainApi";
import { IChain } from "../../types/walletTypes";
import { chains } from "../../consts/contracts";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
export const setChainAsync = createAsyncThunk("set/chain", setChain);

const init: IChain = chains.Solar;

const loadChain: () => IChain = () => {
  const data = tymtStorage.get(`chain`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`chain`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`chain`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadChain(),
  status: "chain",
  altcoin: [],
  pending: false,
  msg: "",
};

export const chainSlice = createSlice({
  name: "chain",
  initialState,
  reducers: {
    setChain: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`chain`, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setChainAsync.pending, (state) => {
        state.status = "pending";
        state.pending = true;
      })
      .addCase(setChainAsync.fulfilled, (state, action) => {
        state.data = action.payload;

        state.pending = false;
        state.msg = "We will contat you as soon as possible";
        tymtStorage.set(`chain`, JSON.stringify(action.payload));
      });
  },
});

export const getChain = (state: any) => state.chain.data;
export const getAltcoins = (state: any) => state.chain.altcoin;

export default chainSlice.reducer;
