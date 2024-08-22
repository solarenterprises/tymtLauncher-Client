import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { IChatroomList } from "../../types/ChatroomAPITypes";
import { fetchPublicChatroomList } from "./PublicChatroomListApi";

const init: IChatroomList = {
  chatrooms: [],
};

const loadPublicChatroomList: () => IChatroomList = () => {
  const data = sessionStorage.getItem(`publicChatroomList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`publicChatroomList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadPublicChatroomList(),
  status: "publicChatroomList",
  msg: "",
};

export const fetchPublicChatroomListAsync = createAsyncThunk("publicChatroomList/fetchPublicChatroomListAsync", fetchPublicChatroomList);

export const publicChatroomListSlice = createSlice({
  name: "publicChatroomList",
  initialState,
  reducers: {
    setPublicChatroomList: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`publicChatroomList`, JSON.stringify(state.data));
      console.log("publicChatroomList", state.data);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPublicChatroomListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchPublicChatroomListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchPublicChatroomListAsync: ", action.payload);
          return;
        }
        state.data.chatrooms = action.payload;
        sessionStorage.setItem(`publicChatroomList`, JSON.stringify(state.data));
        state.status = "publicChatroomList";
      });
  },
});

export const getPublicChatroomList = (state: any) => state.publicChatroomList.data;
export const { setPublicChatroomList } = publicChatroomListSlice.actions;

export default publicChatroomListSlice.reducer;
