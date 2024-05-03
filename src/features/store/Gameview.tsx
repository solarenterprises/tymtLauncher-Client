import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { viewType } from "../../types/storeTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: viewType = {
  mode: "overview",
};

const loadData: () => viewType = () => {
  const data = tymtStorage.get(`gameoverview`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`gameoverview`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`gameoverview`, JSON.stringify(init));
      return init;
    }
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
