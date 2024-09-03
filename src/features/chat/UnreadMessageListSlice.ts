import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { fetchUnreadMessageList } from "./UnreadMessageListApi";

export interface IUnreadMessage {
  chatroomId: string;
  unreadMessageCount: number;
}

export interface IUnreadMessageList {
  data: IUnreadMessage[];
}

const init: IUnreadMessageList = {
  data: [],
};

const loadUnreadMessageList: () => IUnreadMessageList = () => {
  const data = sessionStorage.getItem(`unreadMessageList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`unreadMessageList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadUnreadMessageList(),
  status: "unreadMessageList",
  msg: "",
};

export const fetchUnreadMessageListAsync = createAsyncThunk("unreadMessageList/fetchUnreadMessageListAsync", fetchUnreadMessageList);

export const unreadMessageListSlice = createSlice({
  name: "unreadMessageList",
  initialState,
  reducers: {
    setUnreadMessageList: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`unreadMessageList`, JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUnreadMessageListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUnreadMessageListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchUnreadMessageListAsync: action.payload undefined!");
          return;
        }
        state.data = action.payload;
        sessionStorage.setItem(`unreadMessageList`, JSON.stringify(state.data));
        state.status = "unreadMessageList";
      });
  },
});

export const getUnreadMessageList = (state: any) => state.unreadMessageList.data;
export const { setUnreadMessageList } = unreadMessageListSlice.actions;

export default unreadMessageListSlice.reducer;
