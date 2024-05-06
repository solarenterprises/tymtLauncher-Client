import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { alertbadgeType } from "../../types/alertTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: alertbadgeType = {
  trigger: false,
  badge: false,
};

const loadData: () => alertbadgeType = () => {
  const data = tymtStorage.get(`alertbadge`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`alertbadge`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`alertbadge`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`alertbadge`, JSON.stringify(action.payload));
    },
  },
});

export const selectBadgeStatus = (state: any) => state.alertbadge.data;
export const { setBadgeStatus } = alertbadgeSlice.actions;

export default alertbadgeSlice.reducer;
