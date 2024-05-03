import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = { mode: 0 };

const loadData = () => {
  const data = tymtStorage.get(`librarymode`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`librarymode`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`librarymode`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`librarymode`, JSON.stringify(action.payload));
    },
  },
});

export const getLibrarymode = (state: any) => state.librarymode.data;
export const { setLibraryMode } = LibrarymodeSlice.actions;

export default LibrarymodeSlice.reducer;
