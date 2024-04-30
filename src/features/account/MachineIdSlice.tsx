import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IMachineId } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadMachineId: () => IMachineId = () => {
  const data = tymtStorage.get(`machineId_${tymt_version}`);
  if (data === null || data === "") {
    return {
      machineId: "",
    };
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadMachineId(),
  status: "machineId",
  msg: "",
};

export const machineIdSlice = createSlice({
  name: "machineId",
  initialState,
  reducers: {
    setMachineId: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(
        `machineId_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getMachineId = (state: any) => state.machineId.data;
export const { setMachineId } = machineIdSlice.actions;

export default machineIdSlice.reducer;
