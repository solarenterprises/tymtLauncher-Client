import { createSlice } from "@reduxjs/toolkit";
import { ILogin } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: ILogin = {
  isLoggedIn: false,
};

const loadLogin: () => ILogin = () => {
  const data = sessionStorage.getItem(`login`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`login`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadLogin(),
  status: "login",
  msg: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.data.isLoggedIn = action.payload;
      sessionStorage.setItem(`login`, JSON.stringify(state.data));
    },
  },
});

export const getLogin = (state: any) => state.login.data;
export const { setLogin } = loginSlice.actions;

export default loginSlice.reducer;
