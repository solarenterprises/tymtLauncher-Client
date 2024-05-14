import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { userType } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: userType = {
  onlineStatus: false,
  _id: "",
  nickName: "",
  lang: "",
  sxpAddress: "",
  avatar: "",
  notificationStatus: "",
  friend: false,
};

const loadUser: () => userType = () => {
  const data = tymtStorage.get(`currentPartner`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`currentPartner`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`chatHistory`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadUser(),
  status: "currentPartner",
  msg: "",
};

const partnerSlice = createSlice({
  name: "currentPartner",
  initialState,
  reducers: {
    setCurrentChatPartner(state, action) {
      state.data = action.payload;
      tymtStorage.set(`currentPartner`, JSON.stringify(action.payload));
    },
  },
});

export const selectPartner = (state: any) => state.currentPartner.data;
export const { setCurrentChatPartner } = partnerSlice.actions;

export default partnerSlice.reducer;
