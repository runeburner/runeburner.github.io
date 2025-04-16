import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Incantation } from "./incantations";

type MonacoModel = Incantation & { isDirty: boolean };

type MonacoModelsState = {
  selected: number;
  incantations: MonacoModel[];
};

const initialState: MonacoModelsState = {
  selected: -1,
  incantations: [],
};

const monacoModelsSlice = createSlice({
  name: "monacoModels",
  initialState,
  reducers: {
    loadModel: (state, action: PayloadAction<MonacoModel>) => {
      let index = -1;
      for (let i = 0; i < state.incantations.length; i++) {
        if (state.incantations[i].name === action.payload.name) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        state.selected = index;
      } else {
        state.incantations.push(action.payload);
        state.selected = state.incantations.length - 1;
      }
    },
    closeModel: (state, action: PayloadAction<number>) => {
      state.incantations.splice(action.payload, 1);
      if (state.selected >= state.incantations.length) {
        state.selected = state.incantations.length - 1;
      }
    },
    selectModel: (state, action: PayloadAction<number>) => {
      state.selected = Math.min(state.incantations.length - 1, action.payload);
    },
    setCurrentModelDirty: (state) => {
      state.incantations[state.selected].isDirty = true;
    },
    setCurrentModelClean: (state) => {
      state.incantations[state.selected].isDirty = false;
    },
    closeModalByName: (state, action: PayloadAction<string>) => {
      const ind = state.incantations.findIndex(
        (i) => i.name === action.payload
      );
      if (ind === -1) return;
      state.incantations.splice(ind, 1);
      if (state.selected >= state.incantations.length) {
        state.selected = state.incantations.length - 1;
      }
    },
    renameModel: (state, action: PayloadAction<[string, string]>) => {
      const [old, next] = action.payload;
      for (let i = 0; i < state.incantations.length; i++) {
        if (state.incantations[i].name === old) {
          state.incantations[i].name = next;
          break;
        }
      }
    },
  },
});

export const {
  loadModel,
  closeModel,
  selectModel,
  setCurrentModelDirty,
  setCurrentModelClean,
  renameModel,
  closeModalByName,
} = monacoModelsSlice.actions;
export const monacoModelsReducer = monacoModelsSlice.reducer;
