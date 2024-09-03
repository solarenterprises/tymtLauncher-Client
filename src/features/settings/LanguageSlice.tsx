import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { languageType } from "../../types/settingTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: languageType = {
  language: "en",
};

const loadData: () => languageType = () => {
  const data = tymtStorage.get(`language`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`language`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`language`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadData(),
  status: "language",
  msg: "",
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`language`, JSON.stringify(action.payload));
    },
  },
});

export const selectLanguage = (state: any) => state.language.data;
export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
