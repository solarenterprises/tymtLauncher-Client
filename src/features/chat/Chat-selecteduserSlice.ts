import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = {
  id: "",
};

const loadData = () => {
  const data = tymtStorage.get(`selecteduser`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`selecteduser`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`selecteduser`, JSON.stringify(init));
      return init;
    }
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
