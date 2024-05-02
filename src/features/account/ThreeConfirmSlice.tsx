import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { threeConfirmType } from "../../types/accountTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";

const init: threeConfirmType = {
  first: "",
  second: "",
  third: "",
  focus: 1,
};

const loadThreeConfirm: () => threeConfirmType = () => {
  const data = tymtStorage.get(`threeConfirm`);
  if (data === null || data === "" || !compareJSONStructure(data, init)) {
    return init;
  } else {
    return JSON.parse(data);
  }
};
const initialState = {
  data: loadThreeConfirm(),
  status: "threeConfirm",
  msg: "",
};

export const threeConfirmSlice = createSlice({
  name: "threeConfirm",
  initialState,
  reducers: {
    setThreeConfirm: (state, action) => {
      state.data = action.payload;
      tymtStorage.set(`threeConfirm`, JSON.stringify(action.payload));
    },
  },
});

export const getThreeConfirm = (state: any) => state.threeConfirm.data;
export const { setThreeConfirm } = threeConfirmSlice.actions;

export default threeConfirmSlice.reducer;
