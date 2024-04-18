import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";

const loadData = () => {
  const data = tymtStorage.get(`librarymode_${tymt_version}`);
  if (data === null || data === "") {
    return {
      mode: 0,
    };
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadData(),
  status: "librarymode",
  msg: "",
};

export const LibrarymodeSlice = createSlice({
  name: "librarymode",
  initialState,
  reducers: {
    setLibraryMode: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `librarymode_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getLibrarymode = (state: any) => state.librarymode.data;
export const { setLibraryMode } = LibrarymodeSlice.actions;

export default LibrarymodeSlice.reducer;
