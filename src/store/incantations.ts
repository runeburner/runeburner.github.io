import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `let mining = true;

let crystal = null;

/** @param {RS} rs */
export const tick = ({game, act}) => {
  const me = game.me();
  mining = mining ?
    me.minecapacity[0] < me.minecapacity[1] :
    me.minecapacity[0] === 0;
  if (mining) {
    if (crystal == null || game.at(crystal)[0] !== 1) {
      const crystals = game.findAll(Tile.RUNE_CRYSTAL, 3);
      if (crystals.length === 0) return act.DIE();
      crystal = crystals[Math.floor(Math.random() * crystals.length)];
    }

    return game.isInRange(crystal) ? act.MINE(crystal) : act.MOVE_NEXT_TO(crystal);
  }
  crystal = null;
  const heart = game.findClosestEntity(EntityType.HEART);
  if (heart === null) return act.DIE();
  return game.isInRange(heart.pos) ? act.ATTUNE() : act.MOVE_NEXT_TO(heart.pos);
}`;

export const defaultFight = `export const tick = ({game, act}) => {
  const dummy = game.findClosestEntity(EntityType.DUMMY);
  if (dummy === null) return DIE();
  return game.isInRange(dummy.pos) ? SMASH(dummy.id) : MOVE_NEXT_TO(dummy.pos);
}`;

export const defaultRock = `export const tick = ({game, act}) => {
  const rock = game.findNearest(Tile.ROCK, 3);
  if (rock === null) return DIE();
  return game.isInRange(rock) ? MINE(rock) : MOVE_NEXT_TO(rock);
}`;

const initialState: IncantationsState = {
  basic: defaultIncantation,
  fight: defaultFight,
  rock: defaultRock,
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
