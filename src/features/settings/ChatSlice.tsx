import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
const loadData = () => {
  const data = tymtStorage.get(`chat_${tymt_version}`);
  if (data === null || data === "") {
    return {
      disturb: false,
      message: "anyone",
      friend: "anyone",
    };
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadData(),
  status: "chat",
  msg: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`chat_${tymt_version}`, JSON.stringify(action.payload));
    },
  },
});

export const selectChat = (state: any) => state.chat.data;
export const { setChat } = chatSlice.actions;

export default chatSlice.reducer;
