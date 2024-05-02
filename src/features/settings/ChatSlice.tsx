import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init = {
  disturb: false,
  message: "anyone",
  friend: "anyone",
};

const loadData = () => {
  const data = tymtStorage.get(`chat`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
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
      tymtStorage.set(`chat`, JSON.stringify(action.payload));
    },
  },
});

export const selectChat = (state: any) => state.chat.data;
export const { setChat } = chatSlice.actions;

export default chatSlice.reducer;
