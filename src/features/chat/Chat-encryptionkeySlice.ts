import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { encryptionkeyStoreType } from "../../types/chatTypes";
// import { tymt_version } from "../../configs";

const loadEncryptionStore: () => encryptionkeyStoreType = () => {
  const data = tymtStorage.get(`encryption`);
  if (data === null || data === "") {
    return {
      encryption_Keys: {},
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadEncryptionStore(),
  status: "encryption",
  msg: "",
};

const encryptionkeySlice = createSlice({
  name: "encryption",
  initialState,
  reducers: {
    addEncryptionKey(state, action) {
      const { userId, encryptionKey } = action.payload;
      state.data.encryption_Keys[userId] = encryptionKey;
      tymtStorage.set(
        `encryption`,
        JSON.stringify(state.data)
      );
      console.log("added encryptionkey", state.data.encryption_Keys[userId]);
    },
  },
});

export const selectEncryptionKeyByUserId = (state: any, userId: string) =>
  state.encryption.data.encryption_Keys[userId];
export const selectEncryptionKeyStore = (state: any) => state.encryption.data;
export const { addEncryptionKey } = encryptionkeySlice.actions;

export default encryptionkeySlice.reducer;
