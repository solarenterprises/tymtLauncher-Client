import { createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { ICurrentChatroomMember } from "./CurrentChatroomMembersSlice";

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

const adminListSlice = createSlice({
  name: "adminList",
  initialState,
  reducers: {
    setAdminList(state, action) {
      state.data.admins = action.payload;
      sessionStorage.setItem(`adminList`, JSON.stringify(state.data));
    },
  },
});

export const getAdminList = (state: any) => state.adminList.data;
export const { setAdminList } = adminListSlice.actions;

export default adminListSlice.reducer;
