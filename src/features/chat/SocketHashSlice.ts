import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";
import { ISocketHash } from "../../types/chatTypes";

const load: () => ISocketHash = () => {
  const data = tymtStorage.get(`socketHash_${tymt_version}`);
  if (data === null || data === "") {
    const init: ISocketHash = {
      socketHash: "",
    };
    tymtStorage.set(`socketHash_${tymt_version}`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: load(),
  status: "socketHash",
  msg: "",
};

export const socketHashSlice = createSlice({
  name: "socketHash",
  initialState,
  reducers: {
    setSocketHash: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `socketHash_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getSocketHash = (state: any) => state.socketHash.data;
export const { setSocketHash } = socketHashSlice.actions;

export default socketHashSlice.reducer;
