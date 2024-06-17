import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IMachineId } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: IMachineId = {
  machineId: "",
};

const loadMachineId: () => IMachineId = () => {
  const data = tymtStorage.get(`machineId`);
  if (data === null || data === "" || data === undefined) {
    tymtStorage.set(`machineId`, JSON.stringify(init));
    return init;
  } else {
    if (compareJSONStructure(JSON.parse(data), init)) {
      return JSON.parse(data);
    } else {
      tymtStorage.set(`machineId`, JSON.stringify(init));
      return init;
    }
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
      tymtStorage.set(`machineId`, JSON.stringify(action.payload));
    },
  },
});

export const getMachineId = (state: any) => state.machineId.data;
export const { setMachineId } = machineIdSlice.actions;

export default machineIdSlice.reducer;
