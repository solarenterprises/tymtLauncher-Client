import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { userType } from "../../types/chatTypes";
import { tymt_version } from "../../configs";

const loadUser: () => userType = () => {
  const data = tymtStorage.get(`currentPartner_${tymt_version}`);
  if (data === null || data === "") {
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
      tymtStorage.set(
        `currentPartner_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const selectPartner = (state: any) => state.currentPartner.data;
export const { setCurrentChatPartner } = partnerSlice.actions;

export default partnerSlice.reducer;
