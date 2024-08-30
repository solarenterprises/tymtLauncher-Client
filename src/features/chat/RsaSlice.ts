import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IRsa } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { getRsaKeyPair } from "./RsaApi";

const init: IRsa = {
  publicKey: "",
  privateKey: "",
};

const loadRsa: () => IRsa = () => {
  const data = sessionStorage.getItem(`rsa`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`rsa`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadRsa(),
  status: "rsa",
  msg: "",
};

export const getRsaKeyPairAsync = createAsyncThunk("rsa/getRsaKeyPairAsync", getRsaKeyPair);

export const rsaSlice = createSlice({
  name: "rsa",
  initialState,
  reducers: {
    setRsa: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`rsa`, JSON.stringify(state.data));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getRsaKeyPairAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getRsaKeyPairAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = { ...state.data, ...action.payload };
        sessionStorage.setItem(`rsa`, JSON.stringify(state.data));
        state.status = "rsa";
      });
  },
});

export const getRsa = (state: any) => state.rsa.data;
export const { setRsa } = rsaSlice.actions;

export default rsaSlice.reducer;
