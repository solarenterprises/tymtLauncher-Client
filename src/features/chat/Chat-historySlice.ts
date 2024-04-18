import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import tymtStorage from "../../lib/Storage";
import { ChatHistoryType } from "../../types/chatTypes";
import { setChatHistoryFunc } from "./Chat-historyApi";
import { tymt_version } from "../../configs";

const loadData: () => ChatHistoryType = () => {
  const data = tymtStorage.get(`chatHistory_${tymt_version}`);
  if (data === null || data === "") {
    return {
      messages: [],
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "chatHistory",
  msg: "",
};

export const setChatHistoryAsync = createAsyncThunk(
  "chatHistory/setChatHistory",
  setChatHistoryFunc
);

const chatHistorySlice = createSlice({
  name: "chatHistory",
  initialState,
  reducers: {
    setChatHistory(state, action) {
      state.data = action.payload;
      tymtStorage.set(
        `chatHistory_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setChatHistoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        setChatHistoryAsync.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log(action.payload, "action.payload");
          state.data.messages = action.payload.messages;
          tymtStorage.set(
            `chatHistory_${tymt_version}`,
            JSON.stringify(state.data)
          );
          state.status = "succeeded";
        }
      );
  },
});

export const getChatHistory = (state: any) => state.chatHistory.data;

export default chatHistorySlice.reducer;

export const { setChatHistory } = chatHistorySlice.actions;
