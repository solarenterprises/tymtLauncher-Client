import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { chathistoryperUserStoreType } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
// import { tymt_version } from "../../configs";

const init: chathistoryperUserStoreType = {
  history: {},
};

const loadEncryptionStore: () => chathistoryperUserStoreType = () => {
  const data = tymtStorage.get(`historystore`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`historystore`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`historystore`, JSON.stringify(init));
      return init;
    }
  }
};

const initialState = {
  data: loadEncryptionStore(),
  status: "historystore",
  msg: "",
};

const chathistoryperUserSlice = createSlice({
  name: "historystore",
  initialState,
  reducers: {
    addChatHistoryperUser(state, action) {
      const { userId, encryptedmessage } = action.payload;
      state.data.history[userId] = [encryptedmessage, ...(state.data.history[userId] || [])];
      tymtStorage.set(`historystore`, JSON.stringify(state.data));
      console.log("added encryptionkey", state.data.history[userId]);
    },
  },
});

export const selectchathistoryByUserId = (state: any, userId: string) => {
  // Check if state.historystore.data is defined
  if (state.historystore?.data) {
    // Check if state.historystore.data.history[userId] is defined
    return state.historystore.data.history[userId] || [];
  }
  return []; // Return an empty array if data is not defined
};
export const selectchathistoryperUserStore = (state: any) => state.historystore.data;
export const { addChatHistoryperUser } = chathistoryperUserSlice.actions;

export default chathistoryperUserSlice.reducer;
