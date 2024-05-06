import { createSlice } from "@reduxjs/toolkit";
import { scrollDownType } from "../../types/chatTypes";
import tymtStorage from "../../lib/Storage";

const init: scrollDownType = {
  down: false,
};

const loadData: () => scrollDownType = () => {
  return init;
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
      tymtStorage.set(
        `scrolldown`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getdownState = (state: any) => state.scrolldown.data;

export default scrollDownSlice.reducer;

export const { setdownState } = scrollDownSlice.actions;
