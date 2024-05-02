import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

const init = [];

const loadAddress = () => {
  const data = tymtStorage.get(`address`);
  if (data === null || data === "") {
    return init;
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadAddress(),
  status: "address",
  msg: "",
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  // Reducers to save the language as global state
  reducers: {
    setAddress: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`address`, JSON.stringify(action.payload));
    },
  },
});

export const selectAddress = (state: any) => state.address.data;
export const { setAddress } = addressSlice.actions;

export default addressSlice.reducer;
