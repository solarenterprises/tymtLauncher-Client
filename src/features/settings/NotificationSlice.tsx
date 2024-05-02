import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { notificationType } from "../../types/settingTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: notificationType = {
  alert: true,
  update: false,
  sound: false,
  hour: 1,
  trigger: false,
  alertbadge: false,
};

const loadNotification: () => notificationType = () => {
  const data = tymtStorage.get(`notification`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
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
      tymtStorage.set(`notification`, JSON.stringify(action.payload));
    },
  },
});

export const selectNotification = (state: any) => state.notification.data;
export const { setNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
