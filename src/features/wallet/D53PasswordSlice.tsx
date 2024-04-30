import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { ID53Password } from "../../types/walletTypes";
import { tymt_version } from "../../configs";

const loadD53Password: () => ID53Password = () => {
  const data = tymtStorage.get(`d53Password_${tymt_version}`);
  if (data === null || data === "") {
    const init: ID53Password = {
      password: "",
    };
    tymtStorage.set(`d53Password_${tymt_version}`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
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
      tymtStorage.set(
        `d53Password_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getD53Password = (state: any) => state.d53Password.data;
export const { setD53Password } = d53PasswordSlice.actions;

export default d53PasswordSlice.reducer;
