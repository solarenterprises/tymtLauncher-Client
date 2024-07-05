// Current Chat room is not saved in local stroage, not necessary.
import { createSlice } from "@reduxjs/toolkit";
import { IChatroom } from "../../types/ChatroomAPITypes";

const init: IChatroom = {
  _id: "",
  created_by: "",
  participants: [],
  isDeleted: false,
  isPrivate: false,
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

export const currentChatroomSlice = createSlice({
  name: "currentChatroom",
  initialState,
  reducers: {
    setCurrentChatroom: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem("currentChatroom", JSON.stringify(action.payload));
    },
  },
});

export const getCurrentChatroom = (state: any) => state.currentChatroom.data;
export const { setCurrentChatroom } = currentChatroomSlice.actions;

export default currentChatroomSlice.reducer;
