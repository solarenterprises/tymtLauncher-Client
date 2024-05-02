import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { PaginationType } from "../../types/homeTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: PaginationType = {
  index: 0,
  page: "home",
};

const loadData: () => PaginationType = () => {
  const data = tymtStorage.get(`navigation`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
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
