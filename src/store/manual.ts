import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type ManualState = {
  topic: string[];
};

const initialState: ManualState = {
  topic: [],
};

const slice = createSlice({
  name: "manual",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<string[]>) => {
      state.topic = action.payload;
    },
    appendBreadcrumbs: (state, action: PayloadAction<string>) => {
      state.topic.push(action.payload);
    },
  },
});

export const { setBreadcrumbs, appendBreadcrumbs } = slice.actions;
export const manualReducer = slice.reducer;

export const selectBreadcrumbs = (s: RootState): string[] => s.manual.topic;
