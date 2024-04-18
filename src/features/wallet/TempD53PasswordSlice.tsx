import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { ID53Password } from "../../types/walletTypes";
import { tymt_version } from "../../configs";

const loadTempD53Password: () => ID53Password = () => {
  const data = tymtStorage.get(`tempD53Password_${tymt_version}`);
  if (data === null || data === "") {
    return {
      password: "",
    };
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadTempD53Password(),
  status: "tempD53Password",
  msg: "",
};

export const tempD53PasswordSlice = createSlice({
  name: "tempD53Password",
  initialState,
  reducers: {
    setTempD53Password: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `tempD53Password_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getTempD53Password = (state: any) => state.tempD53Password.data;
export const { setTempD53Password } = tempD53PasswordSlice.actions;

export default tempD53PasswordSlice.reducer;
