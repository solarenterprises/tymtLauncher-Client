import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { ChatHistoryType } from "../../types/chatTypes";
import { setChatHistoryFunc } from "./ChatHistoryApi";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: ChatHistoryType = {
  messages: [],
};

const loadData: () => ChatHistoryType = () => {
  const data = tymtStorage.get(`chatHistory`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`chatHistory`, JSON.stringify(init));
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
  data: loadData(),
  status: "chatHistory",
  msg: "",
};

export const setChatHistoryAsync = createAsyncThunk("chatHistory/setChatHistoryAsync", setChatHistoryFunc);

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    setChatHistory(state, action) {
      state.data = action.payload;
      tymtStorage.set(`chatHistory`, JSON.stringify(action.payload));
    },
    addChatHistory(state, action) {
      state.data.messages = [action.payload, ...state.data.messages];
      tymtStorage.set(`chatHistory`, JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setChatHistoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(setChatHistoryAsync.fulfilled, (state, action: PayloadAction<any>) => {
        console.log(action.payload, "action.payload");
        state.data.messages = action.payload.messages;
        tymtStorage.set(`chatHistory`, JSON.stringify(state.data));
        state.status = "succeeded";
      });
  },
});

export const getChatHistory = (state: any) => state.chatHistory.data;

export default chatHistorySlice.reducer;

export const { setChatHistory, addChatHistory } = chatHistorySlice.actions;
