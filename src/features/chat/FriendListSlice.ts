import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IContactList } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: IContactList = {
  contacts: [],
};

const loadFriendList: () => IContactList = () => {
  const data = tymtStorage.get(`friendList`);
  if (!data || compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`friendList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadFriendList(),
  status: "friendList",
  msg: "",
};

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    setFriendList(state, action) {
      state.data = action.payload;
      tymtStorage.set(`friendList`, JSON.stringify(action.payload));
    },
    deleteOneFromFriendList(state, action) {
      state.data.contacts = state.data.contacts.filter((_: any, index: any) => index !== action.payload);
    },
    addOneToFriendList(state, action) {
      state.data.contacts = [...state.data.contacts, action.payload];
      tymtStorage.set(`friendList`, JSON.stringify(action.payload));
    },
  },
});

export const getFriendList = (state: any) => state.friendList.data;
export const { setFriendList, deleteOneFromFriendList, addOneToFriendList } = friendListSlice.actions;

export default friendListSlice.reducer;
