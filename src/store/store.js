import { configureStore } from "@reduxjs/toolkit";
import getGameSliceReducer from "./slices/game";

export default configureStore({
  reducer: {
    game: getGameSliceReducer,
  },
});
