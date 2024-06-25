import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { IGroupList } from "../../types/chatTypes";
import { createDM, createGroup, deleteGroup, fetchGroupList } from "./GroupListApi";

const init: IGroupList = {
  groups: [],
};

const loadGroupList: () => IGroupList = () => {
  const data = tymtStorage.get(`groupList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`groupList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadGroupList(),
  status: "groupList",
  msg: "",
};

export const fetchGroupListAsync = createAsyncThunk("groupList/fetchGroupListAsync", fetchGroupList);
export const createGroupAsync = createAsyncThunk("groupList/createGroupAsync", createGroup);
export const createDMAsync = createAsyncThunk("groupList/createDMAsync", createDM);
export const deleteGroupAsync = createAsyncThunk("groupList/deleteGroupAsync", deleteGroup);

export const groupListSlice = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    setGroupList: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`groupList`, JSON.stringify(action.payload));
    },
    createGroupMockup: (state, action) => {
      state.data.groups = [action.payload, ...state.data.groups];
      tymtStorage.set(`groupList`, JSON.stringify(state.data));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGroupListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchGroupListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to fetchGroupListAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`groupList`, JSON.stringify(state.data));
        state.status = "groupList";
      })
      .addCase(createGroupAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createGroupAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to createGroupAsync: ", action.payload);
          return;
        }
        state.data.groups = [...state.data.groups, action.payload];
        tymtStorage.set(`groupList`, JSON.stringify(state.data));
        state.status = "groupList";
      })
      .addCase(createDMAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createDMAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to createDMAsync: ", action.payload);
          return;
        }
        state.data.groups = [...state.data.groups, action.payload];
        tymtStorage.set(`groupList`, JSON.stringify(state.data));
        state.status = "groupList";
      })
      .addCase(deleteGroupAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteGroupAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.log("Failed to deleteGroupAsync: ", action.payload);
          return;
        }
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`groupList`, JSON.stringify(state.data));
        state.status = "groupList";
      });
  },
});

export const getGroupList = (state: any) => state.groupList.data;
export const { setGroupList, createGroupMockup } = groupListSlice.actions;

export default groupListSlice.reducer;
