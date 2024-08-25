import { createSlice } from "@reduxjs/toolkit";
import { IDownloadStatus } from "../../types/homeTypes";

const init: IDownloadStatus = {
  progress: 0,
  speed: 0,
  total: 0,
  isDownloading: false,
  game: null,
};

const loadDownloadStatus: () => IDownloadStatus = () => {
  return init;
};

const initialState = {
  data: loadDownloadStatus(),
  status: "downloadStatus",
  msg: "",
};

const downloadStatusSlice = createSlice({
  name: "downloadStatus",
  initialState,
  reducers: {
    setDownloadStatus(state, action) {
      state.data = action.payload;
    },
  },
});

export const getDownloadStatus = (state: any) => state.downloadStatus.data;

export default downloadStatusSlice.reducer;

export const { setDownloadStatus } = downloadStatusSlice.actions;
