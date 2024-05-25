// Token is not saved in local stroage due to the security issue.
// It is cleaned when the app is closed.

import { createSlice } from "@reduxjs/toolkit";
import { ISaltToken } from "../../types/accountTypes";

const init: ISaltToken = {
  salt: "",
  token: "",
};

const loadSaltToken: () => ISaltToken = () => {
  const tokenData = sessionStorage.getItem("saltToken");
  return tokenData ? JSON.parse(tokenData) : init;
};

const initialState = {
  data: loadSaltToken(),
  status: "saltToken",
  msg: "",
};

export const saltTokenSlice = createSlice({
  name: "saltToken",
  initialState,
  reducers: {
    setSaltToken: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem("saltToken", JSON.stringify(action.payload));
    },
  },
});

export const getSaltToken = (state: any) => state.saltToken.data;
export const { setSaltToken } = saltTokenSlice.actions;

export default saltTokenSlice.reducer;
