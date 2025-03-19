import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

type ResourceState = {
  attunement: number;
};

const initialState: ResourceState = {
  attunement: 0,
};

const slice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setAttunement: (state, action: PayloadAction<number>) => {
      state.attunement = action.payload;
    },
  },
});

export const { setAttunement } = slice.actions;
export const resourcesReducer = slice.reducer;

export const useAttunement = (): number =>
  useAppSelector((s) => s.resources.attunement);
