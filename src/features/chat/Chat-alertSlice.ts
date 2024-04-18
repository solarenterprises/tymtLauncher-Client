import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { propsAlertTypes } from "../../types/commonTypes";
import { tymt_version } from "../../configs";

const loadUser: () => propsAlertTypes = () => {
  const data = tymtStorage.get(`chatAlert_${tymt_version}`);
  if (data === null || data === "") {
    return {
      open: false,
      status: "",
      title: "",
      detail: "",
      setOpen: null,
    };
  } else {
    return JSON.parse(data);
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
      tymtStorage.set(
        `chatAlert_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getAlertStatus = (state: any) => state.chatAlert.data;
export const { setAlertStatus } = chatalertSlice.actions;

export default chatalertSlice.reducer;
