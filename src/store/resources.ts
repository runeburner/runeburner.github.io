import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

type ResourceState = {
  musicalNotes: number;
};

const initialState: ResourceState = {
  musicalNotes: 0,
};

const slice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setMusicalNotes: (state, action: PayloadAction<number>) => {
      state.musicalNotes = action.payload;
    },
  },
});

export const { setMusicalNotes } = slice.actions;
export const resourcesReducer = slice.reducer;

export const useMusicalNotes = (): number =>
  useAppSelector((s) => s.resources.musicalNotes);
