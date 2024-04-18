import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { PaginationType } from "../../types/homeTypes";
import { tymt_version } from "../../configs";

const loadData: () => PaginationType = () => {
  const data = tymtStorage.get(`navigation_${tymt_version}`);
  if (data === null || data === "") {
    return {
      index: 0,
      page: "home",
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "navigation",
  msg: "",
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.data = action.payload;
    },
  },
});

export const getCurrentPage = (state: any) => state.navigation.data;

export default navigationSlice.reducer;

export const { setCurrentPage } = navigationSlice.actions;
