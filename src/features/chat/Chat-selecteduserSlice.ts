import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";

const loadData = () => {
  const data = tymtStorage.get(`selecteduser_${tymt_version}`);
  if (data === null || data === "" || data === undefined) {
    return {
      id: "",
    };
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
      tymtStorage.set(
        `selecteduser_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getSelectedUser = (state: any) => state.selecteduser.data;
export default selecteduserSlice.reducer;

export const { setSelectedUsertoDelete } = selecteduserSlice.actions;
