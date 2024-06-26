import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { IChatroomList } from "../../types/ChatroomAPITypes";
import { createDM, createGroup, fetchChatroomList } from "./ChatroomListApi";

const init: IChatroomList = {
  chatrooms: [],
};

const loadChatroomList: () => IChatroomList = () => {
  const data = tymtStorage.get(`groupList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`groupList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadChatroomList(),
  status: "chatroomList",
  msg: "",
};

export const fetchChatroomListAsync = createAsyncThunk("groupList/fetchGroupListAsync", fetchChatroomList);
export const createGroupAsync = createAsyncThunk("groupList/createGroupAsync", createGroup);
export const createDMAsync = createAsyncThunk("groupList/createDMAsync", createDM);

export const chatroomListSlice = createSlice({
  name: "chatroomList",
  initialState,
  reducers: {
    setChatroomList: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`chatroomList`, JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchChatroomListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchChatroomListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchGroupListAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = action.payload;
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(createGroupAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createGroupAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to createGroupAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = [...state.data.chatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      })
      .addCase(createDMAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createDMAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to createDMAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = [...state.data.chatrooms, action.payload];
        tymtStorage.set(`chatroomList`, JSON.stringify(state.data));
        state.status = "chatroomList";
      });
  },
});

export const getChatroomList = (state: any) => state.chatroomList.data;
export const { setChatroomList } = chatroomListSlice.actions;

export default chatroomListSlice.reducer;
