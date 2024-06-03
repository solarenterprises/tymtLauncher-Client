// Current Partner is not saved in local stroage, not necessary.

import { createSlice } from "@reduxjs/toolkit";
import { IContact } from "../../types/chatTypes";

const init: IContact = {
  _id: "",
  nickName: "",
  sxpAddress: "",
  onlineStatus: false,
  lastAvailable: "",
  notificationStatus: "",
  lang: "en",
};

const loadCurrentPartner: () => IContact = () => {
  const data = sessionStorage.getItem("currentPartner");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadCurrentPartner(),
  status: "currentPartner",
  msg: "",
};

export const currentPartnerSlice = createSlice({
  name: "currentPartner",
  initialState,
  reducers: {
    setCurrentPartner: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem("currentPartner", JSON.stringify(action.payload));
    },
  },
});

export const getCurrentPartner = (state: any) => state.currentPartner.data;
export const { setCurrentPartner } = currentPartnerSlice.actions;

export default currentPartnerSlice.reducer;
