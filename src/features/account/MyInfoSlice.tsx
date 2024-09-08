import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMyInfo } from "../../types/chatTypes";
import { fetchMyInfo } from "./MyInfoApi";

const init: IMyInfo = {
  _id: "",
  nickName: "",
  avatar: "",
  wallet: [],
  lang: "",
  twoFactor: false,
  sxpAddress: "",
  status: 0,
  isDeleted: false,
  isAdmin: false,
  onlineStatus: false,
  createdAt: "",
  updatedAt: "",
  __v: 0,
  lastAvailable: "",
  solarPubKey: "",
  notificationStatus: "",
  contact: [],
  friend: [],
  block: [],
  rsa_pub_key: "",
  roles: [],
};

const loadMyInfo: () => IMyInfo = () => {
  const data = sessionStorage.getItem(`myInfo`);
  if (!data) {
    sessionStorage.setItem(`myInfo`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadMyInfo(),
  status: "myInfo",
  msg: "",
};

export const fetchMyInfoAsync = createAsyncThunk("myInfo/fetchMyInfoAsync", fetchMyInfo);

export const myInfoSlice = createSlice({
  name: "myInfo",
  initialState,
  reducers: {
    setMyInfo: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`myInfo`, JSON.stringify(state.data));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMyInfoAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMyInfoAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchMyInfoAsync: action.payload undefined!", action.payload);
          return;
        }
        state.data = action.payload;
        sessionStorage.setItem(`myInfo`, JSON.stringify(state.data));
        state.status = "myInfo";
      });
  },
});

export const getMyInfo = (state: any) => state.myInfo.data;
export const { setMyInfo } = myInfoSlice.actions;

export default myInfoSlice.reducer;
