import { createSlice } from "@reduxjs/toolkit";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

export interface IRenderTime {
  renderTime: number;
}

const init: IRenderTime = {
  renderTime: 0,
};

const loadRenderTime: () => IRenderTime = () => {
  const data = sessionStorage.getItem(`renderTime`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
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
      sessionStorage.setItem(`renderTime`, JSON.stringify(action.payload));
    },
  },
});

export const getRenderTime = (state: any) => state.renderTime.data;
export const { setRenderTime } = renderTimeSlice.actions;

export default renderTimeSlice.reducer;
