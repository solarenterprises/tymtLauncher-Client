import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { languageType } from "../../types/settingTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: languageType = {
  language: "en",
};

const loadData: () => languageType = () => {
  const data = tymtStorage.get(`language`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    tymtStorage.set(`language`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
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
