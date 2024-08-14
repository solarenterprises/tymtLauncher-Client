import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { ICurrentChatroomMember } from "./CurrentChatroomMembersSlice";
import { fetchAdminList } from "./AdminListApi";

export interface IAdminList {
  admins: ICurrentChatroomMember[];
}

const init: IAdminList = {
  admins: [],
};

const loadAdminList: () => IAdminList = () => {
  const data = sessionStorage.getItem(`adminList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`adminList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadAdminList(),
  status: "adminList",
  msg: "",
};

export const fetchAdminListAsync = createAsyncThunk("adminList/fetchAdminListAsync", fetchAdminList);

const adminListSlice = createSlice({
  name: "adminList",
  initialState,
  reducers: {
    setAdminList(state, action) {
      state.data.admins = action.payload;
      sessionStorage.setItem(`adminList`, JSON.stringify(state.data));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminListAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchAdminListAsync: undefined!", action.payload);
          return;
        }
        state.data = action.payload;
        sessionStorage.setItem(`adminList`, JSON.stringify(state.data));
        state.status = "adminList";
      });
  },
});

export const getAdminList = (state: any) => state.adminList.data;
export const { setAdminList } = adminListSlice.actions;

export default adminListSlice.reducer;
