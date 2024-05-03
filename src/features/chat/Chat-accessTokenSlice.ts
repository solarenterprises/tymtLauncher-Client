import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = {
  accessToken: "",
};

const loadUser = () => {
  const data = tymtStorage.get(`accesstoken`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`accesstoken`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`accesstoken`, JSON.stringify(init));
      return init;
    }
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
