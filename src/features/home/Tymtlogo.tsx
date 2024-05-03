import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { TymtlogoType } from "../../types/homeTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: TymtlogoType = {
  isDrawerExpanded: true,
};

const loadData: () => TymtlogoType = () => {
  const data = tymtStorage.get(`tymtlogo`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`tymtlogo`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`tymtlogo`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`tymtlogo`, JSON.stringify(action.payload));
    },
  },
});

export const getCurrentLogo = (state: any) => state.tymtlogo.data;

export default tymtlogoSlice.reducer;

export const { setCurrentLogo } = tymtlogoSlice.actions;
