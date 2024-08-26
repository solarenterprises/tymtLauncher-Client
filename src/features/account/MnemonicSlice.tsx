// Mnemonic is not saved in local stroage due to the security issue.
// It is cleaned when the app is closed.

import { createSlice } from "@reduxjs/toolkit";
import { IMnemonic } from "../../types/accountTypes";

const init: IMnemonic = {
  mnemonic: "",
};

const loadMnemonic: () => IMnemonic = () => {
  const mnemonicData = sessionStorage.getItem("mnemonic");
  return mnemonicData ? JSON.parse(mnemonicData) : init;
};

const initialState = {
  data: loadMnemonic(),
  status: "mnemonic",
  msg: "",
};

export const mnemonicSlice = createSlice({
  name: "mnemonic",
  initialState,
  reducers: {
    setMnemonic: (state, action) => {
      state.data.mnemonic = action.payload;
      sessionStorage.setItem("mnemonic", JSON.stringify(action.payload));
    },
  },
});

export const getMnemonic = (state: any) => state.mnemonic.data;
export const { setMnemonic } = mnemonicSlice.actions;

export default mnemonicSlice.reducer;
