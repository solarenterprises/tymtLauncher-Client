import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = {
  alert: true,
  update: false,
  sound: false,
  unreadmessage: 0,
};

const loadNotification = () => {
  const data = tymtStorage.get(`chatnotification`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`chatnotification`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`chatnotification`, JSON.stringify(init));
      return init;
    }
  }
};
const initialState = {
  data: loadNotification(),
  status: "chatnotification",
  msg: "",
};

export const chatnotificationSlice = createSlice({
  name: "chatnotification",
  initialState,
  reducers: {
    setchatNotification: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`chatnotification`, JSON.stringify(action.payload));
    },
  },
});

export const getchatNotification = (state: any) => state.chatnotification.data;
export const { setchatNotification } = chatnotificationSlice.actions;

export default chatnotificationSlice.reducer;
