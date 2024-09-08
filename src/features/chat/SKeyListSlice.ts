// sKey is not saved in local stroage, not necessary.
import { createSlice } from "@reduxjs/toolkit";

export interface ISKey {
  roomId: string;
  sKey: string;
}

export interface ISKeyList {
  sKeys: ISKey[];
}

const init: ISKeyList = {
  sKeys: [],
};

const loadSKey: () => ISKeyList = () => {
  const data = sessionStorage.getItem("sKeyList");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadSKey(),
  status: "sKeyList",
  msg: "",
};

export const sKeyListSlice = createSlice({
  name: "sKeyList",
  initialState,
  reducers: {
    setSKeyList: (state, action) => {
      state.data.sKeys = action.payload;
      sessionStorage.setItem("sKeyList", JSON.stringify(state.data));
    },
    addOneSKeyList: (state, action) => {
      if (!action.payload || !action.payload.roomId || !action.payload.sKey) {
        console.error("Failed to addOneSkeyList: action.payload undefined!", action.payload);
        return;
      }
      const restOfSkeys = state.data.sKeys.filter((element) => element.roomId !== action.payload.roomId);
      state.data.sKeys = [...restOfSkeys, action.payload];
      sessionStorage.setItem("sKeyList", JSON.stringify(state.data));
    },
    delOneSkeyList: (state, action) => {
      const restOfSkeys = state.data.sKeys.filter((element) => element.roomId !== action.payload);
      state.data.sKeys = [...restOfSkeys];
      sessionStorage.setItem("sKeyList", JSON.stringify(state.data));
    },
  },
});

export const getSKeyList = (state: any) => state.sKeyList.data;
export const { setSKeyList, addOneSKeyList, delOneSkeyList } = sKeyListSlice.actions;

export default sKeyListSlice.reducer;
