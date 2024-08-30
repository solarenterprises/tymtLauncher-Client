import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";
import { IChatroomList } from "../../types/ChatroomAPITypes";
import { fetchGlobalChatroomList } from "./GlobalChatroomListApi";

const init: IChatroomList = {
  chatrooms: [],
};

const loadGlobalChatroomList: () => IChatroomList = () => {
  const data = sessionStorage.getItem(`globalChatroomList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`globalChatroomList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadGlobalChatroomList(),
  status: "globalChatroomList",
  msg: "",
};

export const fetchGlobalChatroomListAsync = createAsyncThunk("globalChatroomList/fetchGlobalChatroomListAsync", fetchGlobalChatroomList);

export const globalChatroomListSlice = createSlice({
  name: "globalChatroomList",
  initialState,
  reducers: {
    setGlobalChatroomList: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`globalChatroomList`, JSON.stringify(state.data));
      console.log("globalChatroomList", state.data);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGlobalChatroomListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchGlobalChatroomListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchGlobalChatroomListAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = action.payload;
        sessionStorage.setItem(`globalChatroomList`, JSON.stringify(state.data));
        state.status = "globalChatroomList";
      });
  },
});

export const getGlobalChatroomList = (state: any) => state.globalChatroomList.data;
export const { setGlobalChatroomList } = globalChatroomListSlice.actions;

export default globalChatroomListSlice.reducer;
