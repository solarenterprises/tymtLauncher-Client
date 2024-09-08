import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IContactList } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { createFriend, deleteFriend, fetchFriendList } from "./FriendListApi";

const init: IContactList = {
  contacts: [],
};

const loadFriendList: () => IContactList = () => {
  const data = tymtStorage.get(`friendList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
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

export const fetchFriendListAsync = createAsyncThunk("friendList/fetchContactListAsync", fetchFriendList);
export const createFriendAsync = createAsyncThunk("friendList/createFriendAsync", createFriend);
export const deleteFriendAsync = createAsyncThunk("friendList/deleteFriendAsync", deleteFriend);

const friendListSlice = createSlice({
  name: "friendList",
  initialState,
  reducers: {
    setFriendList(state, action) {
      state.data = action.payload;
      tymtStorage.set(`friendList`, JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFriendListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchFriendListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchFriendListAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`friendList`, JSON.stringify(state.data));
        state.status = "friendList";
      })
      .addCase(createFriendAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createFriendAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to createFriendAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`friendList`, JSON.stringify(state.data));
        state.status = "friendList";
      })
      .addCase(deleteFriendAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteFriendAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to deleteFriendAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`friendList`, JSON.stringify(state.data));
        state.status = "friendList";
      });
  },
});

export const getFriendList = (state: any) => state.friendList.data;
export const { setFriendList } = friendListSlice.actions;

export default friendListSlice.reducer;
