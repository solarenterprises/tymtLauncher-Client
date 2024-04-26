import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";

const loadNotification = () => {
  const data = tymtStorage.get(`chatnotification_${tymt_version}`);
  if (data === null || data === "") {
    return {
      alert: true,
      update: false,
      sound: false,
      unreadmessage: 0,
    };
  } else {
    return JSON.parse(data);
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
      tymtStorage.set(
        `chatnotification_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getchatNotification = (state: any) => state.chatnotification.data;
export const { setchatNotification } = chatnotificationSlice.actions;

export default chatnotificationSlice.reducer;
