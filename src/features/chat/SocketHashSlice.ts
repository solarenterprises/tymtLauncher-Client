import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { ISocketHash } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

const init: ISocketHash = {
  socketHash: "",
};

const load: () => ISocketHash = () => {
  const data = tymtStorage.get(`socketHash`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`socketHash`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
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
      state.data.socketHash = action.payload;
      tymtStorage.set(`socketHash`, JSON.stringify(state.data));
    },
  },
});

export const getSocketHash = (state: any) => state.socketHash.data;
export const { setSocketHash } = socketHashSlice.actions;

export default socketHashSlice.reducer;
