import { createSlice } from "@reduxjs/toolkit";

const getGameSlice = createSlice({
  name: "cards",
  initialState: {
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
  },
});

export const { gameModeReducer, updateErrors, removeErrors } = getGameSlice.actions;

export default getGameSlice.reducer;
