// Current Chat room is not saved in local stroage, not necessary.
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChatroom } from "../../types/ChatroomAPITypes";
import { fetchCurrentChatroom } from "./CurrentChatroomApi";

const init: IChatroom = {
  _id: "",
  created_by: "",
  participants: [],
  isDeleted: false,
  isPrivate: false,
  isGlobal: false,
  room_name: "",
  createdAt: "",
  updatedAt: "",
  __v: 0,
};

const loadCurrentChatroom: () => IChatroom = () => {
  const data = sessionStorage.getItem("currentChatroom");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadCurrentChatroom(),
  status: "currentChatroom",
  msg: "",
};

export const fetchCurrentChatroomAsync = createAsyncThunk("currentChatroom/fetchCurrentChatroomAsync", fetchCurrentChatroom);

export const currentChatroomSlice = createSlice({
  name: "currentChatroom",
  initialState,
  reducers: {
    setCurrentChatroom: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem("currentChatroom", JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentChatroomAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCurrentChatroomAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchCurrentChatroomAsync: ", action.payload);
          return;
        }
        state.data = action.payload;
        sessionStorage.setItem(`currentChatroom`, JSON.stringify(state.data));
        state.status = "currentChatroom";
      });
  },
});

export const getCurrentChatroom = (state: any) => state.currentChatroom.data;
export const { setCurrentChatroom } = currentChatroomSlice.actions;

export default currentChatroomSlice.reducer;
