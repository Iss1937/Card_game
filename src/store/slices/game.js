import { createSlice } from "@reduxjs/toolkit";
const getGameSlice = createSlice({
  name: "game",

  initialState: {
    gameRegime: false,
  },
  reducers: {
    gameModeReducer(state) {
      state.gameRegime ? (state.gameRegime = false) : (state.gameRegime = true);
    },
  },
});

export const { gameModeReducer } = getGameSlice.actions;
export default getGameSlice.reducer;
