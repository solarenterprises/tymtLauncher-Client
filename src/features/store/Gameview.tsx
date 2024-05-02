import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { viewType } from "../../types/storeTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: viewType = {
  mode: "overview",
};

const loadData: () => viewType = () => {
  const data = tymtStorage.get(`gameoverview`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "gameoverview",
  msg: "",
};

export const gameoverviewSlice = createSlice({
  name: "gameoverview",
  initialState,
  reducers: {
    setViewmode: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`gameoverview`, JSON.stringify(action.payload));
    },
  },
});

export const getViewmode = (state: any) => state.gameoverview.data;
export const { setViewmode } = gameoverviewSlice.actions;

export default gameoverviewSlice.reducer;
