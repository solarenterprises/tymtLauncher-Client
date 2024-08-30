import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

export interface IActiveUserList {
  users: string[];
}

const init: IActiveUserList = {
  users: [],
};

const loadActiveUserList: () => IActiveUserList = () => {
  const data = tymtStorage.get(`activeUserList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`activeUserList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadActiveUserList(),
  status: "activeUserList",
  msg: "",
};

const activeUserListSlice = createSlice({
  name: "activeUserList",
  initialState,
  reducers: {
    setActiveUserList(state, action) {
      state.data.users = action.payload;
      tymtStorage.set(`activeUserList`, JSON.stringify(state.data));
    },
    addOneActiveUserList(state, action) {
      if (!state.data.users.some((element) => element === action.payload)) {
        state.data.users = [...state.data.users, action.payload];
        tymtStorage.set(`activeUserList`, JSON.stringify(state.data));
      }
    },
    delOneActiveUserList(state, action) {
      const restOfUsers = state.data.users.filter((user) => user !== action.payload);
      state.data.users = [...restOfUsers];
      tymtStorage.set(`activeUserList`, JSON.stringify(state.data));
    },
  },
});

export const getActiveUserList = (state: any) => state.activeUserList.data;
export const { setActiveUserList, addOneActiveUserList, delOneActiveUserList } = activeUserListSlice.actions;

export default activeUserListSlice.reducer;
