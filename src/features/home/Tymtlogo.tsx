import { createSlice } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { TymtlogoType } from "../../types/homeTypes";
import { tymt_version } from "../../configs";

const loadData: () => TymtlogoType = () => {
  const data = tymtStorage.get(`tymtlogo_${tymt_version}`);
  if (data === null || data === "") {
    return {
      isDrawerExpanded: true,
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "tymtlogo",
  msg: "",
};

const tymtlogoSlice = createSlice({
  name: "tymtlogo",
  initialState,
  reducers: {
    setCurrentLogo(state, action) {
      state.data = action.payload;
      tymtStorage.set(
        `tymtlogo_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getCurrentLogo = (state: any) => state.tymtlogo.data;

export default tymtlogoSlice.reducer;

export const { setCurrentLogo } = tymtlogoSlice.actions;
