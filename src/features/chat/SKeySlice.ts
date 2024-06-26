// sKey is not saved in local stroage, not necessary.
import { createSlice } from "@reduxjs/toolkit";
import { IChatroom } from "../../types/ChatroomAPITypes";

export interface SKey {
  sKey: string;
}

const init: SKey = {
  sKey: "",
};

const loadSKey: () => IChatroom = () => {
  const data = sessionStorage.getItem("sKey");
  return data ? JSON.parse(data) : init;
};

const initialState = {
  data: loadSKey(),
  status: "sKey",
  msg: "",
};

export const currentSKeySlice = createSlice({
  name: "sKey",
  initialState,
  reducers: {
    setSKey: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem("sKey", JSON.stringify(action.payload));
    },
  },
});

export const getSKey = (state: any) => state.sKey.data;
export const { setSKey } = currentSKeySlice.actions;

export default currentSKeySlice.reducer;
