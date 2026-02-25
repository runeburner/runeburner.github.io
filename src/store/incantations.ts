import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";
import { RootState } from "./store";

const INCANTATION_KEY = "RUNEBURNER_INCANTATIONS";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `
// global variables we need to keep track of what we were doing.
let mining = true;
let crystal: RuneCrystalEntity | null = null;

// The action we need to take if we are in the mining stage.
const miningRoutine = ({ world, me, act }: RS) => {
  // If we don't have crystal to target. We first find one.
  if (crystal == null || crystal.quantity === 0) {
    const crystals = world.findAll(EntityType.RUNE_CRYSTAL, 3) as RuneCrystalEntity[];
    if (crystals.length === 0) return act.FADE();
    for (const c of crystals) {
      // Filter out crystals we can't reach.
      if (!me.hasPathTo(c.pos)) continue
      crystal = c;
    }
    if (crystal === null) return act.FADE();
  }
  // Mine or move towards a crystal depending if we can touch it.
  return me.isInRange(crystal.pos) ? act.MINE(crystal.id) : act.MOVE_NEXT_TO(crystal.pos);
}

// The action we take if we have crystals.
// Here we go back to the heart and sing until we're empty.
const singingRoutine = ({ world, me, act }: RS) => {
  crystal = null;
  const heart = world.findClosestEntity(EntityType.HEART) as HeartEntity;
  if (heart === null) return act.FADE();
  return me.isInRange(heart.pos) ? act.SING() : act.MOVE_NEXT_TO(heart.pos);
}

export const tick: Ticker = (rs: RS) => {
  const { me } = rs
  // Mine crystals until our inventory is full, sing until it's empty.
  mining = mining ?
    me.runeCrystals() < me.runeCrystalCapacity() :
    me.runeCrystals() === 0;
  if (mining) return miningRoutine(rs);
  return singingRoutine(rs)
}`;

export const defaultFight = `export const tick: Ticker = ({ world, me, act }: RS) => {
  // Find the closest dummy entity
  const dummy = world.findClosestEntity(EntityType.DUMMY);
  // If there are no dummy nearby, simply fade away to make room for other golems.
  if (dummy === null) return act.FADE();
  // If we are within range of the dummy, smash it, otherwise, move closer.
  return me.isInRange(dummy.pos) ? act.SMASH(dummy.id) : act.MOVE_NEXT_TO(dummy.pos);
}`;

export const defaultRock = `export const tick: Ticker = ({ world, me, act }: RS) => {
  // Find closest rock, we intent on mining it.
  const rock = world.findClosestEntity(EntityType.ROCK) as RockEntity | null;
  // If there are no rock nearby, simply fade away to make room for other golems.
  if (rock === null) return act.FADE();
  // If we are within range of the rock, mine it, otherwise, move closer.
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
  (i) => Object.keys(i),
);

export const useIncantationNames = (): string[] =>
  useAppSelector(selectIncantationNames);
