import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = {
  id: "",
};

const loadData = () => {
  const data = tymtStorage.get(`selecteduser`);
  if (
    data === null ||
    data === "" ||
    data === undefined ||
    !compareJSONStructure(data, init)
  ) {
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "selecteduser",
  msg: "",
};

const selecteduserSlice = createSlice({
  name: "selecteduser",
  initialState,
  reducers: {
    setSelectedUsertoDelete(state, action) {
      state.data = action.payload;
      tymtStorage.set(`selecteduser`, JSON.stringify(action.payload));
    },
  },
});

export const getSelectedUser = (state: any) => state.selecteduser.data;
export default selecteduserSlice.reducer;

export const { setSelectedUsertoDelete } = selecteduserSlice.actions;
