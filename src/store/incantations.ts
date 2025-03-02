import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `let mining = true;

/** @param {RS} rs */
export const tick = (rs) => {
  const me = rs.me();
  mining = mining ?
    me.minecapacity[0] < me.minecapacity[1] :
    me.minecapacity[0] === 0;
  if(mining) {
    const crystal = rs.findNearest("MANA_CRYSTAL", 19);
    if(!rs.isInRange(crystal)) {
      return MOVE_NEXT_TO(crystal);
    } else {
      return MINE(crystal);
    }
  } else {
    const heart = rs.findClosestEntity("HEART");
    if(!rs.isInRange(heart)) {
      return MOVE_NEXT_TO(heart);
    } else {
      return ATTUNE();
    }
  }
}`;

const initialState: IncantationsState = {
  basic: defaultIncantation,
  other: `function HelloWorld() {
}`,
};

export type Incantation = {
  name: string;
  content: string;
};

const incantationsSlice = createSlice({
  name: "incantations",
  initialState,
  reducers: {
    saveIncantation: (state, action: PayloadAction<Incantation>) => {
      state[action.payload.name] = action.payload.content;
    },
    renameIncantation: (state, action: PayloadAction<[string, string]>) => {
      const [old, next] = action.payload;
      state[next] = state[old];
      delete state[old];
    },
  },
});

export const { saveIncantation, renameIncantation } = incantationsSlice.actions;
export const incantationReducer = incantationsSlice.reducer;

export const selectIncantationNames = createSelector(
  [(s: RootState): Record<string, string> => s.incantations],
  (i) => Object.keys(i)
);

export const useIncantationNames = (): string[] =>
  useAppSelector(selectIncantationNames);
