// Current Chat room members are not saved in local stroage, not necessary.
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICurrentChatroomMember } from "./CurrentChatroomMembersSlice";
import { fetchHistoricalChatroomMembers } from "./HistoricalChatroomMembersApi";

export interface ICurrentChatroomMembers {
  members: ICurrentChatroomMember[];
}

const init: ICurrentChatroomMembers = {
  members: [],
};

const loadHistoricalChatroomMembers: () => ICurrentChatroomMembers = () => {
  const data = sessionStorage.getItem("historicalChatroomMembers");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadHistoricalChatroomMembers(),
  status: "historicalChatroomMembers",
  msg: "",
};

export const fetchHistoricalChatroomMembersAsync = createAsyncThunk(
  "historicalChatroomMembers/fetchHistoricalChatroomMembersAsync",
  fetchHistoricalChatroomMembers
);

export const historicalChatroomMembersSlice = createSlice({
  name: "historicalChatroomMembers",
  initialState,
  reducers: {
    setHistoricalChatroomMembers: (state, action) => {
      state.data.members = action.payload;
      sessionStorage.setItem("historicalChatroomMembers", JSON.stringify(state.data));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchHistoricalChatroomMembersAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchHistoricalChatroomMembersAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchHistoricalChatroomMembersAsync: ", action.payload);
          return;
        }
        console.log("fetchHistoricalChatroomMembersAsync");
        state.data.members = action.payload;
        sessionStorage.setItem("historicalChatroomMembers", JSON.stringify(state.data));
        state.status = "historicalChatroomMembers";
      });
  },
});

export const getHistoricalChatroomMembers = (state: any) => state.historicalChatroomMembers.data;
export const { setHistoricalChatroomMembers } = historicalChatroomMembersSlice.actions;

export default historicalChatroomMembersSlice.reducer;
