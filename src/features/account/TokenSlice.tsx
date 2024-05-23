// Token is not saved in local stroage due to the security issue.
// It is cleaned when the app is closed.

import { createSlice } from "@reduxjs/toolkit";
import { IToken } from "../../types/accountTypes";

const init: IToken = {
  salt: "",
  token: "",
};

const loadToken: () => IToken = () => {
  const tokenData = sessionStorage.getItem("token");
  return tokenData ? JSON.parse(tokenData) : init;
};

const initialState = {
  data: loadToken(),
  status: "token",
  msg: "",
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem("token", JSON.stringify(action.payload));
    },
  },
});

export const getToken = (state: any) => state.token.data;
export const { setToken } = tokenSlice.actions;

export default tokenSlice.reducer;
