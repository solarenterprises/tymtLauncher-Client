import { createSlice } from "@reduxjs/toolkit";
import { ICurrentChain } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { ChainNames } from "../../consts/Chains";

const init: ICurrentChain = {
  chain: ChainNames.SOLAR,
};

const loadCurrentChain: () => ICurrentChain = () => {
  const data = sessionStorage.getItem(`currentChain`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`currentChain`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadCurrentChain(),
  status: "currentChain",
  msg: "",
};

export const currentChainSlice = createSlice({
  name: "currentChain",
  initialState,
  reducers: {
    setCurrentChain: (state, action) => {
      state.data.chain = action.payload;
      sessionStorage.setItem(`currentChain`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentChain = (state: any) => state.currentChain.data;
export const { setCurrentChain } = currentChainSlice.actions;

export default currentChainSlice.reducer;
