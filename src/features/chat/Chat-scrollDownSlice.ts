import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
import { scrollDownType } from "../../types/chatTypes";

const loadData: () => scrollDownType= () => {
  const data = tymtStorage.get(`scrolldown_${tymt_version}`);
  if (data === null || data === "") {
    return {
      down: false
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "scrolldown",
  msg: "",
};

const scrollDownSlice = createSlice({
  name: "scrolldown",
  initialState,
  reducers: {
    setdownState(state, action) {
      state.data = action.payload;
      // tymtStorage.set("navigation", JSON.stringify(action.payload));
    },
  },
});

export const getdownState = (state: any) => state.scrolldown.data;

export default scrollDownSlice.reducer;

export const { setdownState } = scrollDownSlice.actions;
