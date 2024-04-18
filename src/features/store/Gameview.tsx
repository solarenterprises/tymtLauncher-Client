import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { viewType } from "../../types/storeTypes";
import { tymt_version } from "../../configs";

const loadData: () => viewType = () => {
  const data = tymtStorage.get(`gameoverview_${tymt_version}`);
  if (data === null || data === "") {
    return {
      mode: "overview",
    };
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
      tymtStorage.set(
        `gameoverview_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getViewmode = (state: any) => state.gameoverview.data;
export const { setViewmode } = gameoverviewSlice.actions;

export default gameoverviewSlice.reducer;
