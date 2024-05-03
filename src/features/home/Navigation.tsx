import { createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/homeTypes";

const init: PaginationType = {
  index: 0,
  page: "home",
};

const loadData: () => PaginationType = () => {
  return init;
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
