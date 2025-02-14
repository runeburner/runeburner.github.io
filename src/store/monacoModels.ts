import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Incantation } from "./incantations";

type MonacoModelsState = {
  selected: number;
  incantations: Incantation[];
};

const initialState: MonacoModelsState = {
  selected: -1,
  incantations: [],
};

const monacoModelsSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    loadModel: (state, action: PayloadAction<Incantation>) => {
      state.incantations.push(action.payload);
      state.selected = state.incantations.length - 1;
    },
  },
});

export const { loadModel } = monacoModelsSlice.actions;
export const monacoModelsReducer = monacoModelsSlice.reducer;
