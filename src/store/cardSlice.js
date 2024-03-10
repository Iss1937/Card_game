import { createSlice } from "@reduxjs/toolkit";

const getGameSlice = createSlice({
  name: "cards",
  initialState: {
    leaders: [],
    currentLevel: null,
    gameModeReducer: false,
    errors: 0,
  },
  reducers: {
    setLeaders(state, action) {
      state.leaders = action.payload.leaders;
    },
    gameModeReducer(state) {
      state.gameModeReducer = !state.gameModeReducer;
    },
    updateErrors(state) {
      state.errors = state.errors + 1;
    },
    removeErrors(state) {
      state.errors = 0;
    },
    setCurrentLevel(state, action) {
      state.currentLevel = action.payload.choosenLevel;
    },
  },
});

export const { setLeaders, gameModeReducer, updateErrors, removeErrors, setCurrentLevel } = getGameSlice.actions;

export default getGameSlice.reducer;
