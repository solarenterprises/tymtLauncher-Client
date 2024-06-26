import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { ISocketHash } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: ISocketHash = {
  socketHash: "",
};

const load: () => ISocketHash = () => {
  const data = tymtStorage.get(`socketHash`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`socketHash`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`socketHash`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`socketHash`, JSON.stringify(action.payload));
    },
  },
});

export const getSocketHash = (state: any) => state.socketHash.data;
export const { setSocketHash } = socketHashSlice.actions;

export default socketHashSlice.reducer;
