import { createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";

import { threeConfirmType } from "../../types/accountTypes";
import { tymt_version } from "../../configs";

const loadThreeConfirm: () => threeConfirmType = () => {
  const data = tymtStorage.get(`threeConfirm_${tymt_version}`);
  if (data === null || data === "") {
    return {
      first: "",
      second: "",
      third: "",
      focus: 1,
    };
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
      tymtStorage.set(
        `threeConfirm_${tymt_version}`,
        JSON.stringify(action.payload)
      );
    },
  },
});

export const getThreeConfirm = (state: any) => state.threeConfirm.data;
export const { setThreeConfirm } = threeConfirmSlice.actions;

export default threeConfirmSlice.reducer;
