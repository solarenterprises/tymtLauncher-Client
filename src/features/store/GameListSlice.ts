import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGameList } from "../../types/GameTypes";
import tymtStorage from "../../lib/Storage";
import { fetchAllGameList, fetchGameList } from "./GameListApi";

const init: IGameList = {
  games: [],
};

const loadGameList = () => {
  const data = tymtStorage.get(`gameList`);
  if (!data) {
    tymtStorage.set(`gameList`, JSON.stringify(init));
    return init;
  }
  return JSON.parse(data);
};

const initialState = {
  data: loadGameList(),
  status: "gameList",
  msg: "",
};

export const fetchGameListAsync = createAsyncThunk("gameList/fetchGameListAsync", fetchGameList);
export const fetchAllGameListAsync = createAsyncThunk("gameList/fetchAllGameListAsync", fetchAllGameList);

const gameListSlice = createSlice({
  name: "gameList",
  initialState,
  reducers: {
    setGameList(state, action) {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGameListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchGameListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchGameListAsync: action.payload undefined!");
          return;
        }
        state.data = action.payload;
        tymtStorage.set(`gameList`, JSON.stringify(state.data));
        state.status = "fetchGameListAsync";
      })
      .addCase(fetchAllGameListAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAllGameListAsync.fulfilled, (state, action: PayloadAction<any>) => {
        if (!action.payload) {
          console.error("Failed to fetchAllGameListAsync: action.payload undefined!");
          return;
        }
        state.data = action.payload;
        tymtStorage.set(`gameList`, JSON.stringify(state.data));
        state.status = "fetchAllGameListAsync";
      });
  },
});

export const getGameList = (state: any) => state.gameList.data;

export default gameListSlice.reducer;

export const { setGameList } = gameListSlice.actions;
