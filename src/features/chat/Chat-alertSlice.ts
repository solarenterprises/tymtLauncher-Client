import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { propsAlertTypes } from "../../types/commonTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: propsAlertTypes = {
  open: false,
  status: "",
  title: "",
  detail: "",
  setOpen: null,
  link: "",
};

const loadUser: () => propsAlertTypes = () => {
  const data = tymtStorage.get(`chatAlert`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`chatAlert`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`chatAlert`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadUser(),
  status: "chatAlert",
  msg: "",
};

const chatalertSlice = createSlice({
  name: "chatAlert",
  initialState,
  reducers: {
    setAlertStatus(state, action) {
      state.data = action.payload;
      tymtStorage.set(`chatAlert`, JSON.stringify(action.payload));
    },
  },
});

export const getAlertStatus = (state: any) => state.chatAlert.data;
export const { setAlertStatus } = chatalertSlice.actions;

export default chatalertSlice.reducer;
