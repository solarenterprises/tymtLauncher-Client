import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";

const loadAddress = () => {
  const data = tymtStorage.get(`address_${tymt_version}`);
  if (data === null || data === "") {
    return [];
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
      tymtStorage.set(
        `address_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const selectAddress = (state: any) => state.address.data;
export const { setAddress } = addressSlice.actions;

export default addressSlice.reducer;
