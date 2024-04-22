import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { userType } from "../../types/chatTypes";
import { tymt_version } from "../../configs";

const loadData: () => userType[] = () => {
  const data = tymtStorage.get(`chatfriendlist_${tymt_version}`);
  if (data === null || data === "" || data === undefined) {
    return [];
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadData(),
  status: "chatfriendlist",
  msg: "",
};

const chatFriendList = createSlice({
  name: "chatfriendlist",
  initialState,
  reducers: {
    setFriendlist(state, action) {
      state.data = action.payload;
      tymtStorage.set(
        `chatfriendlist_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
    deleteFriendlist(state, action) {
      state.data = state.data.filter(
        (_: any, index: any) => index !== action.payload
      );
    },
    addFriendlist(state, action) {
      state.data = [...state.data, action.payload];
      tymtStorage.set(
        `chatfriendlist_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getFriendlist = (state: any) => state.chatfriendlist.data || [];
export default chatFriendList.reducer;

export const { setFriendlist, deleteFriendlist, addFriendlist } =
  chatFriendList.actions;
