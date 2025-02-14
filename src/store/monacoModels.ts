import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Incantation } from "./incantations";

type MonacoModel = Incantation & { isDirty: boolean };

type MonacoModelsState = {
  selected: number;
  incantations: MonacoModel[];
};

const initialState: MonacoModelsState = {
  selected: 0,
  incantations: [],
};

const monacoModelsSlice = createSlice({
  name: "monaco",
  initialState,
  reducers: {
    loadModel: (state, action: PayloadAction<MonacoModel>) => {
      state.incantations.push(action.payload);
      state.selected = state.incantations.length - 1;
    },
    closeModel: (state, action: PayloadAction<number>) => {
      state.incantations.splice(action.payload, 1);
      if (state.selected >= state.incantations.length) {
        state.selected = state.incantations.length - 1;
      }
    },
    selectModel: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
    setCurrentModelDirty: (state) => {
      state.incantations[state.selected].isDirty = true;
    },
  },
});

export const { loadModel, closeModel, selectModel, setCurrentModelDirty } =
  monacoModelsSlice.actions;
export const monacoModelsReducer = monacoModelsSlice.reducer;
