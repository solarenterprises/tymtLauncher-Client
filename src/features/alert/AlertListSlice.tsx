import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IAlertList } from "../../types/alertTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import {
  fetchAlertList,
  fetchCountUnreadAlertList,
  fetchReadAlertList,
  fetchUnreadAlertList,
  updateAlertReadStatus,
  updateAllAlertReadStatus,
  updateFriendRequest,
} from "./AlertListApi";

const init: IAlertList = {
  read: [],
  readCount: 0,
  unread: [],
  unreadCount: 0,
};

const loadAlertList: () => IAlertList = () => {
  const data = tymtStorage.get(`alertList`);
  if (!data) {
    tymtStorage.set(`alertList`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`alertList`, JSON.stringify(init));
      return init;
    }
  }
};
const initialState = {
  data: loadAlertList(),
  status: "alertList",
  msg: "",
};

export const fetchReadAlertListAsync = createAsyncThunk("alertList/fetchReadAlertList", fetchReadAlertList);
export const fetchUnreadAlertListAsync = createAsyncThunk("alertList/fetchUnreadAlertList", fetchUnreadAlertList);
export const fetchAlertListAsync = createAsyncThunk("alertList/fetchAlertList", fetchAlertList);
export const fetchCountUnreadAlertListAsync = createAsyncThunk("alertList/fetchCountUnreadAlertList", fetchCountUnreadAlertList);
export const updateAlertReadStatusAsync = createAsyncThunk("alertList/updateAlertReadStatus", updateAlertReadStatus);
export const updateAllAlertReadStatusAsync = createAsyncThunk("alertList/updateAllAlertReadStatus", updateAllAlertReadStatus);
export const updateFriendRequestAsync = createAsyncThunk("alertList/updateFriendRequest", updateFriendRequest);

export const alertListSlice = createSlice({
  name: "alertList",
  initialState,
  reducers: {
    setAlertList: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`alertList`, JSON.stringify(action.payload));
    },
    addOneToUnreadList: (state, action) => {
      state.data.unread = [...state.data.unread, action.payload];
      state.data.unreadCount = state.data.unreadCount + 1;
      tymtStorage.set(`alertList`, JSON.stringify(state.data));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAlertListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAlertListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`alertList`, JSON.stringify(state.data));
        state.status = "alertList";
      })
      .addCase(fetchReadAlertListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchReadAlertListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload && !action.payload.read) {
          console.error("Failed to fetchReadAlertListSync: action.payload.read undefined");
        }
        state.data = { ...state.data, read: [...state.data.read, ...action.payload.read], readCount: action.payload.readCount };
        tymtStorage.set(`alertList`, JSON.stringify(state.data));
        state.status = "alertList";
      })
      .addCase(fetchUnreadAlertListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUnreadAlertListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload && !action.payload.read) {
          console.error("Failed to fetchUnreadAlertListSync: action.payload.read undefined");
        }
        state.data = { ...state.data, unread: [...state.data.unread, ...action.payload.unread], unreadCount: action.payload.unreadCount };
        tymtStorage.set(`alertList`, JSON.stringify(state.data));
        state.status = "alertList";
      })
      .addCase(updateAlertReadStatusAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateAlertReadStatusAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action?.payload || !action?.payload?._id) {
          console.error("Failed to updateAlertReadStatusAsync: action.payload undefined");
          return;
        }
        const target = state.data.unread.find((element) => element._id === action.payload._id);
        if (!target) return;
        state.data.unread = state.data.unread.filter((element) => element._id !== action.payload._id);
        state.data.unreadCount = state.data.unreadCount - 1;
        state.data.read = [...state.data.read, target];
        state.data.readCount = state.data.readCount + 1;
        tymtStorage.set(`alertList`, JSON.stringify(state.data));
        state.status = "alertList";
      })
      .addCase(updateAllAlertReadStatusAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateAllAlertReadStatusAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          return;
        }
        state.data.read = [];
        state.data.unread = [];
        tymtStorage.set(`alertList`, JSON.stringify(state.data));
        state.status = "alertList";
      })
      .addCase(updateFriendRequestAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateFriendRequestAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          return;
        }
        const target = state.data.unread.find((element) => element._id === action.payload._id);
        if (!target) return;
        state.data.unread = state.data.unread.filter((element) => element._id !== action.payload._id);
        state.data.unreadCount = state.data.unreadCount - 1;
        state.data.read = [...state.data.read, target];
        state.data.readCount = state.data.readCount + 1;
        tymtStorage.set(`alertList`, JSON.stringify(state.data));
        state.status = "alertList";
      });
  },
});

export const getAlertList = (state: any) => state.alertList.data;
export const { setAlertList, addOneToUnreadList } = alertListSlice.actions;

export default alertListSlice.reducer;
