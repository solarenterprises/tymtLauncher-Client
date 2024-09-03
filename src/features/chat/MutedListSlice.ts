import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createMutedList, deleteMutedList, fetchMutedList } from "./MutedListApi";
import { IChatroomList } from "../../types/ChatroomAPITypes";

const init: IChatroomList = {
  chatrooms: [],
};

const loadMutedList: () => IChatroomList = () => {
  const data = sessionStorage.getItem("mutedList");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadMutedList(),
  status: "mutedList",
  msg: "",
};

export const fetchMutedListAsync = createAsyncThunk("mutedList/fetchMutedListAsync", fetchMutedList);
export const createMutedListAsync = createAsyncThunk("mutedList/createMutedListAsync", createMutedList);
export const deleteMutedListAsync = createAsyncThunk("mutedList/deleteMutedListAsync", deleteMutedList);

const mutedListSlice = createSlice({
  name: "mutedList",
  initialState,
  reducers: {
    setMutedList(state, action) {
      state.data.chatrooms = action.payload;
      sessionStorage.setItem(`mutedList`, JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMutedListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMutedListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchMutedListAsync: ", action.payload);
          return;
        }
        console.log("fetchMutedListAsync");
        state.data.chatrooms = action.payload;
        sessionStorage.setItem("mutedList", JSON.stringify(state.data));
        state.status = "mutedList";
      })
      .addCase(createMutedListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createMutedListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to createMutedListAsync: ", action.payload);
          return;
        }
        console.log("createMutedListAsync");
        state.data.chatrooms = action.payload;
        sessionStorage.setItem("mutedList", JSON.stringify(state.data));
        state.status = "mutedList";
      })
      .addCase(deleteMutedListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteMutedListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to deleteMutedListAsync: ", action.payload);
          return;
        }
        console.log("deleteMutedListAsync");
        state.data.chatrooms = action.payload;
        sessionStorage.setItem("mutedList", JSON.stringify(state.data));
        state.status = "mutedList";
      });
  },
});

export const getMutedList = (state: any) => state.mutedList.data;
export const { setMutedList } = mutedListSlice.actions;

export default mutedListSlice.reducer;
