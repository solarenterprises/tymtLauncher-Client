// Current Chat room members are not saved in local stroage, not necessary.
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addOneCurrentChatroomMembers, fetchCurrentChatroomMembers } from "./CurrentChatroomMembersApi";

export interface ICurrentChatroomMemberWallet {
  chainId: number;
  chainName: string;
  address: string;
}

export interface ICurrentChatroomMember {
  _id: string;
  nickName: string;
  wallet?: ICurrentChatroomMemberWallet[];
  lang?: string;
  twoFactor?: boolean;
  contact?: string[];
  sxpAddress: string;
  status: number;
  isDeleted: boolean;
  isAdmin: boolean;
  onlineStatus: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  lastAvailable: string;
  solarPubKey?: string;
  notificationStatus: string;
  friend?: string[];
  block?: string[];
  rsa_pub_key?: string;
}

export interface ICurrentChatroomMembers {
  members: ICurrentChatroomMember[];
}

const init: ICurrentChatroomMembers = {
  members: [],
};

const loadCurrentChatroomMembers: () => ICurrentChatroomMembers = () => {
  const data = sessionStorage.getItem("currentChatroom");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadCurrentChatroomMembers(),
  status: "currentChatroomMembers",
  msg: "",
};

export const fetchCurrentChatroomMembersAsync = createAsyncThunk("currentChatroomMembers/fetchCurrentChatroomMembersAsync", fetchCurrentChatroomMembers);
export const addOneCurrentChatroomMembersAsync = createAsyncThunk("currentChatroomMembers/addOneCurrentChatroomMembersAsync", addOneCurrentChatroomMembers);

export const currentChatroomMembersSlice = createSlice({
  name: "currentChatroomMembers",
  initialState,
  reducers: {
    setCurrentChatroomMembers: (state, action) => {
      state.data.members = action.payload;
      sessionStorage.setItem("currentChatroomMembers", JSON.stringify(state.data));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentChatroomMembersAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCurrentChatroomMembersAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchCurrentChatroomMembersAsync: ", action.payload);
          return;
        }
        console.log("fetchCurrentChatroomMembersAsync");
        state.data.members = action.payload;
        sessionStorage.setItem("currentChatroomMembers", JSON.stringify(state.data));
        state.status = "currentChatroomMembers";
      })
      .addCase(addOneCurrentChatroomMembersAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addOneCurrentChatroomMembersAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to addOneCurrentChatroomMembersAsync: ", action.payload);
          return;
        }
        console.log("addOneCurrentChatroomMembersAsync");
        state.data.members = action.payload;
        sessionStorage.setItem("currentChatroomMembers", JSON.stringify(state.data));
        state.status = "currentChatroomMembers";
      });
  },
});

export const getCurrentChatroomMembers = (state: any) => state.currentChatroomMembers.data;
export const { setCurrentChatroomMembers } = currentChatroomMembersSlice.actions;

export default currentChatroomMembersSlice.reducer;
