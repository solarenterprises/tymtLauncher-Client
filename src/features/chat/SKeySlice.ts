// sKey is not saved in local stroage, not necessary.
import { createSlice } from "@reduxjs/toolkit";

export interface ISKey {
  sKey: string;
}

const init: ISKey = {
  sKey: "",
};

const loadSKey: () => ISKey = () => {
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
      state.data.sKey = action.payload;
      sessionStorage.setItem("sKey", JSON.stringify(state.data));
    },
  },
});

export const getSKey = (state: any) => state.sKey.data;
export const { setSKey } = currentSKeySlice.actions;

export default currentSKeySlice.reducer;
