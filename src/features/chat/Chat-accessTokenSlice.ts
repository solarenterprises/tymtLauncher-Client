import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = {
  accessToken: "",
};

const loadUser = () => {
  const data = tymtStorage.get(`accesstoken`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadUser(),
  status: "accesstoken",
  msg: "",
};

const accesstokenSlice = createSlice({
  name: "accesstoken",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.data = action.payload;
      tymtStorage.set(`accesstoken`, JSON.stringify(action.payload));
    },
  },
});

export const getAccessToken = (state: any) => state.accesstoken.data;
export const { setAccessToken } = accesstokenSlice.actions;

export default accesstokenSlice.reducer;
