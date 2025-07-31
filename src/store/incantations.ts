import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

const INCANTATION_KEY = "RUNEBURNER_INCANTATIONS";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `let mining = true;
let crystal: RuneCrystalEntity | null = null;

const miningRoutine = ({ world, me, act }: RS) => {
  if (crystal == null || crystal.quantity === 0) {
    const crystals = world.findAll(EntityType.RUNE_CRYSTAL, 3) as RuneCrystalEntity[];
    if (crystals.length === 0) return act.FADE();
    for (const c of crystals) {
      if (!me.hasPathTo(c.pos)) continue
      crystal = c;
    }
    if (crystal === null) return act.FADE();
  }

  return me.isInRange(crystal.pos) ? act.MINE(crystal.id) : act.MOVE_NEXT_TO(crystal.pos);
}

const singingRoutine = ({ world, me, act }: RS) => {
  crystal = null;
  const heart = world.findClosestEntity(EntityType.HEART) as HeartEntity;
  if (heart === null) return act.FADE();
  return me.isInRange(heart.pos) ? act.SING() : act.MOVE_NEXT_TO(heart.pos);
}

export const tick: Ticker = (rs: RS) => {
  const { me } = rs
  mining = mining ?
    me.runeCrystals() < me.runeCrystalCapacity() :
    me.runeCrystals() === 0;
  if (mining) return miningRoutine(rs);
  return singingRoutine(rs)
}`;

export const defaultFight = `export const tick: Ticker = ({ world, me, act }: RS) => {
  const dummy = world.findClosestEntity(EntityType.DUMMY);
  if (dummy === null) return act.FADE();
  return me.isInRange(dummy.pos) ? act.SMASH(dummy.id) : act.MOVE_NEXT_TO(dummy.pos);
}`;

export const defaultRock = `export const tick: Ticker = ({ world, me, act }: RS) => {
  const rock = world.findClosestEntity(EntityType.ROCK) as RockEntity | null;
  if (rock === null) return act.FADE();
  return me.isInRange(rock.pos) ? act.MINE(rock.id) : act.MOVE_NEXT_TO(rock.pos);
}`;

export const emptyFile = `export const tick: Ticker = (rs: RS) => {
};`;

const initialState: IncantationsState = ((): IncantationsState => {
  const localState = localStorage.getItem(INCANTATION_KEY);
  if (localState !== null) return JSON.parse(localState);
  return {
    rock: defaultRock,
    noteGatherer: defaultIncantation,
    // fight: defaultFight,
  };
})();

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
      localStorage.setItem(INCANTATION_KEY, JSON.stringify(state));
    },
    renameIncantation: (state, action: PayloadAction<[string, string]>) => {
      const [old, next] = action.payload;
      state[next] = state[old];
      delete state[old];
      localStorage.setItem(INCANTATION_KEY, JSON.stringify(state));
    },
    removeIncantation: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
      localStorage.setItem(INCANTATION_KEY, JSON.stringify(state));
    },
  },
});

export const { saveIncantation, renameIncantation, removeIncantation } =
  incantationsSlice.actions;
export const incantationReducer = incantationsSlice.reducer;

export const selectIncantationNames = createSelector(
  [(s: RootState): Record<string, string> => s.incantations],
  (i) => Object.keys(i)
);

export const useIncantationNames = (): string[] =>
  useAppSelector(selectIncantationNames);
