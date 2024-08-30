import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { ID53Password } from "../../types/walletTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: ID53Password = {
  password: "",
};

const loadD53Password: () => ID53Password = () => {
  const data = tymtStorage.get(`d53Password`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`d53Password`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`d53Password`, JSON.stringify(init));
      return init;
    }
  }
};
const initialState = {
  data: loadD53Password(),
  status: "d53Password",
  msg: "",
};

export const d53PasswordSlice = createSlice({
  name: "d53Password",
  initialState,
  reducers: {
    setD53Password: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`d53Password`, JSON.stringify(action.payload));
    },
  },
});

export const getD53Password = (state: any) => state.d53Password.data;
export const { setD53Password } = d53PasswordSlice.actions;

export default d53PasswordSlice.reducer;
