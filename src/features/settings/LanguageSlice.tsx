import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { languageType } from "../../types/settingTypes";
import { tymt_version } from "../../configs";

const loadData: () => languageType = () => {
  const data = tymtStorage.get(`language_${tymt_version}`);
  if (data === null || data === "") {
    return {
      language: "en",
    };
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
      tymtStorage.set(
        `language_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const selectLanguage = (state: any) => state.language.data;
export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
