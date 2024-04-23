import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
import { notificationType } from "../../types/settingTypes";

const loadNotification: () => notificationType = () => {
  const data = tymtStorage.get(`notification_${tymt_version}`);
  if (data === null || data === "") {
    return {
      alert: true,
      update: false,
      sound: false,
      hour: 1,
      trigger: false,
      alertbadge: false
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadNotification(),
  status: "notification",
  msg: "",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `notification_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const selectNotification = (state: any) => state.notification.data;
export const { setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
