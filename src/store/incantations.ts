import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `let mining = true;

let crystal = null;

/** @param {RS} rs */
export const tick = (rs) => {
  const me = rs.me();
  mining = mining ?
    me.minecapacity[0] < me.minecapacity[1] :
    me.minecapacity[0] === 0;
  if (mining) {
    if(crystal == null || rs.at(crystal)[0] !== 1) {
      const crystals = rs.findAll("MANA_CRYSTAL", 19);
      if(crystals.length === 0) return DIE();
      crystal = crystals[Math.floor(Math.random()*crystals.length)];
    }

    // const crystal = rs.findNearest("MANA_CRYSTAL", 19);
    return rs.isInRange(crystal) ? MINE(crystal) : MOVE_NEXT_TO(crystal);
  }
  crystal = null;
  const heart = rs.findClosestEntity("HEART");
  return rs.isInRange(heart) ? ATTUNE() : MOVE_NEXT_TO(heart);
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
