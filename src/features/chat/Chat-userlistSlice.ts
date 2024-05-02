import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { userType } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: userType = {
  onlineStatus: true,
  _id: "",
  nickName: "",
  lang: "",
  sxpAddress: "",
  avatar: "",
  notificationStatus: "",
  friend: true,
};

const loadData: () => userType[] = () => {
  const data = tymtStorage.get(`chatuserlist`);
  if (
    data === null ||
    data === "" ||
    data === undefined ||
    data[0] === undefined ||
    !compareJSONStructure(data[0], init)
  ) {
    return [];
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "chatuserlist",
  msg: "",
};

const chatUserList = createSlice({
  name: "chatuserList",
  initialState,
  reducers: {
    setUserList(state, action) {
      state.data = action.payload;
      tymtStorage.set(`chatuserlist`, JSON.stringify(action.payload));
    },
    deleteUserList(state, action) {
      state.data = state.data.filter(
        (_: any, index: any) => index !== action.payload
      );
    },
    addUserlist(state, action) {
      state.data.push(action.payload);
      tymtStorage.set(`chatuserlist`, JSON.stringify(action.payload));
    },
  },
});

export const getUserlist = (state: any) => state.chatuserlist.data || [];
export default chatUserList.reducer;

export const { setUserList, deleteUserList, addUserlist } =
  chatUserList.actions;
