import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import { eq, Vec } from "../types/vec";

type InspectionState = {
  pos: Vec;
};

const initialState: InspectionState = {
  pos: [0, 0],
};

const slice = createSlice({
  name: "inspection",
  initialState,
  reducers: {
    setInspectionTile: (state, action: PayloadAction<Vec>) => {
      if (eq(state.pos, action.payload)) return;
      state.pos = action.payload;
    },
  },
});

export const { setInspectionTile } = slice.actions;
export const inspectionReducer = slice.reducer;

export const useInspectedTile = (): Vec =>
  useAppSelector((s) => s.inspection.pos);
