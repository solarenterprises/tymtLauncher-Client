import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { userType } from "../../types/chatTypes";

const loadUser: () => userType[] = () => {
  const data = tymtStorage.get(`currentPartner`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`currentPartner`, JSON.stringify([]));
    return [];
  } else {
    return JSON.parse(data);
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
