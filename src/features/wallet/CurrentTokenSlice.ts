import { createSlice } from "@reduxjs/toolkit";
import { ICurrentToken } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: ICurrentToken = {
  token: "",
};

const loadCurrentToken: () => ICurrentToken = () => {
  const data = sessionStorage.getItem(`currentToken`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`currentToken`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadCurrentToken(),
  status: "currentToken",
  msg: "",
};

export const currentTokenSlice = createSlice({
  name: "currentToken",
  initialState,
  reducers: {
    setCurrentToken: (state, action) => {
      state.data.token = action.payload;
      sessionStorage.setItem(`currentToken`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentToken = (state: any) => state.currentToken.data;
export const { setCurrentToken } = currentTokenSlice.actions;

export default currentTokenSlice.reducer;
