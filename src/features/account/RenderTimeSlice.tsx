import { createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/helper/JSONHelper";

export interface IRenderTime {
  renderTime: number;
}

const init: IRenderTime = {
  renderTime: Date.now(),
};

const loadRenderTime: () => IRenderTime = () => {
  const data = sessionStorage.getItem(`renderTime`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    sessionStorage.setItem(`renderTime`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadRenderTime(),
  status: "renderTime",
  msg: "",
};

export const renderTimeSlice = createSlice({
  name: "renderTime",
  initialState,
  reducers: {
    setRenderTime: (state, action) => {
      state.data = action.payload;
      sessionStorage.setItem(`renderTime`, JSON.stringify(state.data));
    },
  },
});

export const getRenderTime = (state: any) => state.renderTime.data;
export const { setRenderTime } = renderTimeSlice.actions;

export default renderTimeSlice.reducer;
