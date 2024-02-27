import { createSlice } from "@reduxjs/toolkit";

const getGameSlice = createSlice({
  name: "cards",
  initialState: {
    currentLevel: null,
    gameRegime: false,
    errors: 0,
  },
  reducers: {
    gameModeReducer(state) {
      state.gameRegime = !state.gameRegime;
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

export const { gameModeReducer, updateErrors, removeErrors, setCurrentLevel } = getGameSlice.actions;

export default getGameSlice.reducer;
