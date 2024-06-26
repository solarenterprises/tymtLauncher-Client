import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { encryptionkeyStoreType } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
// import { tymt_version } from "../../configs";

const init: encryptionkeyStoreType = {
  encryption_Keys: {},
};

const loadEncryptionStore: () => encryptionkeyStoreType = () => {
  const data = tymtStorage.get(`encryption`);
  if (!data || compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`encryption`, JSON.stringify(init));
    return init;
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
      tymtStorage.set(`encryption`, JSON.stringify(state.data));
    },
  },
});

export const selectEncryptionKeyByUserId = (state: any, userId: string) => {
  return state.encryption.data.encryption_Keys[userId];
};
export const selectEncryptionKeyStore = (state: any) => state.encryption.data;
export const { addEncryptionKey } = encryptionkeySlice.actions;

export default encryptionkeySlice.reducer;
