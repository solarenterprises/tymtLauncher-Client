import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { tymt_version } from "../../configs";

const loadUser = () => {
  const data = tymtStorage.get(`intercomsupport_${tymt_version}`);
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
        `intercomsupport_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
    setMountedTrue(state) {
      state.data = { mounted: true };
      tymtStorage.set(
        `intercomsupport_${tymt_version}`,
        JSON.stringify({ mounted: true })
      );
    },
    setMountedFalse(state) {
      state.data = { mounted: false };
      tymtStorage.set(
        `intercomsupport_${tymt_version}`,
        JSON.stringify({ mounted: false })
      );
    },
  },
});

export const getChatMounted = (state: any) => state.intercomsupport.data;
export const { setChatMounted, setMountedFalse, setMountedTrue } =
  intercomSupportSlice.actions;

export default intercomSupportSlice.reducer;
