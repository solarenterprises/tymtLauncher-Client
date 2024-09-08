import { createSlice } from "@reduxjs/toolkit";
import { IGame, IGameList } from "../../types/GameTypes";

const init: IGameList = {
  games: [],
};

const loadRemoveStatus: () => IGameList = () => {
  return init;
};

const initialState = {
  data: loadRemoveStatus(),
  status: "removeStatus",
  msg: "",
};

const removeStatusSlice = createSlice({
  name: "removeStatus",
  initialState,
  reducers: {
    setRemoveStatus(state, action) {
      state.data.games = action.payload;
    },
    addRemoveStatus(state, action) {
      const data = action.payload as IGame;
      if (!data) {
        console.log("Failed to addRemoveStatus: action.payload is not IGame!", data);
      }
      state.data.games = [...state.data.games, data];
    },
    delRemoveStatus(state, action) {
      const data = action.payload as IGame;
      if (!data) {
        console.log("Failed to addRemoveStatus: action.payload is not IGame!", data);
      }
      const rest = state.data.games.filter((game) => game?._id !== data?._id);
      state.data.games = rest;
    },
  },
});

export const getRemoveStatus = (state: any) => state.removeStatus.data;

export default removeStatusSlice.reducer;

export const { setRemoveStatus, addRemoveStatus, delRemoveStatus } = removeStatusSlice.actions;
