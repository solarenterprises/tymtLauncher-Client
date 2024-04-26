import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
    
const loadData = () => {
  const data = tymtStorage.get(`alertbadge_${tymt_version}`);
  if (data === null || data === "") {
    return {
      trigger: false,
      badge:false
    };
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadData(),
  status: "alertbadge",
  msg: "",
};

export const alertbadgeSlice = createSlice({
  name: "alertbadge",
  initialState,
  reducers: {
    setBadgeStatus: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`alertbadge_${tymt_version}`, JSON.stringify(action.payload));
    },
  },
});

export const selectBadgeStatus = (state: any) => state.alertbadge.data;
export const {  setBadgeStatus } = alertbadgeSlice.actions;

export default alertbadgeSlice.reducer;
