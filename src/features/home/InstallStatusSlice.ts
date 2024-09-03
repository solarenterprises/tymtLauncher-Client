import { createSlice } from "@reduxjs/toolkit";
import { IInstallStatus } from "../../types/homeTypes";

const init: IInstallStatus = {
  progress: 0,
  isInstalling: false,
  name: "",
};

const loadInstallStatus: () => IInstallStatus = () => {
  return init;
};

const initialState = {
  data: loadInstallStatus(),
  status: "installStatus",
  msg: "",
};

const installStatusSlice = createSlice({
  name: "installStatus",
  initialState,
  reducers: {
    setInstallStatus(state, action) {
      state.data = action.payload;
    },
  },
});

export const getInstallStatus = (state: any) => state.installStatus.data;

export default installStatusSlice.reducer;

export const { setInstallStatus } = installStatusSlice.actions;
