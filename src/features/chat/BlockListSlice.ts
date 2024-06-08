import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tymtStorage from "../../lib/Storage";
import { IContactList } from "../../types/chatTypes";
import { compareJSONStructure } from "../../lib/api/JSONHelper";
import { createBlock, deleteBlock, fetchBlockList } from "./BlockListApi";

const init: IContactList = {
  contacts: [],
};

const loadBlockList: () => IContactList = () => {
  const data = tymtStorage.get(`blockList`);
  if (!data || !compareJSONStructure(JSON.parse(data), init)) {
    tymtStorage.set(`blockList`, JSON.stringify(init));
    return init;
  } else {
    return JSON.parse(data);
  }
};

const initialState = {
  data: loadBlockList(),
  status: "blockList",
  msg: "",
};

export const fetchBlockListAsync = createAsyncThunk("blockList/fetchBlockListAsync", fetchBlockList);
export const createBlockAsync = createAsyncThunk("blockList/createBlockAsync", createBlock);
export const deleteBlockAsync = createAsyncThunk("blockList/deleteBlockAsync", deleteBlock);

const blockListSlice = createSlice({
  name: "blockList",
  initialState,
  reducers: {
    setBlockList(state, action) {
      state.data = action.payload;
      tymtStorage.set(`blockList`, JSON.stringify(action.payload));
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBlockListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchBlockListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`blockList`, JSON.stringify(state.data));
        state.status = "blockList";
      })
      .addCase(createBlockAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createBlockAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`blockList`, JSON.stringify(state.data));
        state.status = "blockList";
      })
      .addCase(deleteBlockAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteBlockAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = { ...state.data, ...action.payload };
        tymtStorage.set(`blockList`, JSON.stringify(state.data));
        state.status = "blockList";
      });
  },
});

export const getBlockList = (state: any) => state.blockList.data;
export const { setBlockList } = blockListSlice.actions;

export default blockListSlice.reducer;
