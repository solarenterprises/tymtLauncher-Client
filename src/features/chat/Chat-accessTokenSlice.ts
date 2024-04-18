import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";

const loadUser = () => {
  const data = tymtStorage.get(`accesstoken_${tymt_version}`);
  if (data === null || data === "") {
    return {
      accessToken: "",
    };
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
      tymtStorage.set(
        `accesstoken_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getAccessToken = (state: any) => state.accesstoken.data;
export const { setAccessToken } = accesstokenSlice.actions;

export default accesstokenSlice.reducer;
