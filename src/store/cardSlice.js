import { createSlice } from "@reduxjs/toolkit";

const getGameSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [],
    gameRegime: false,
  },
  reducers: {
    gameModeReducer(state, action) {
      if (state.gameRegime) {
        state.gameRegime = action.payload;
      } else {
        state.gameRegime = !action.payload;
      }
    },
  },
});

export const { gameModeReducer } = getGameSlice.actions;

export default getGameSlice.reducer;
