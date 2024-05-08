import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

const loadUser = () => {
  const data = tymtStorage.get(`intercomsupport`);
  if (data === null || data === "") {
    return {
      mounted: false,
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadUser(),
  status: "intercomsupport",
  msg: "",
};

const intercomSupportSlice = createSlice({
  name: "intercomsupport",
  initialState,
  reducers: {
    setChatMounted(state, action) {
      state.data = action.payload;
      tymtStorage.set(
        `intercomsupport`,
        JSON.stringify(action.payload)
      );
    },
    setMountedTrue(state) {
      state.data = { mounted: true };
      tymtStorage.set(
        `intercomsupport`,
        JSON.stringify({ mounted: true })
      );

      (window as any).Intercom('update', {
        'hide_default_launcher': true
      });
    },
    setMountedFalse(state) {
      state.data = { mounted: false };
      tymtStorage.set(
        `intercomsupport`,
        JSON.stringify({ mounted: false })
      );

      (window as any).Intercom('update', {
        'hide_default_launcher': false
      });
    },
  },
});

export const getChatMounted = (state: any) => state.intercomsupport.data;
export const { setChatMounted, setMountedFalse, setMountedTrue } =
  intercomSupportSlice.actions;

export default intercomSupportSlice.reducer;
