import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `(async () => {
  while(true) {
    const pong = await world.ping();
    await new Promise((res) => {
    setTimeout(res, 1000)});
  }
})();
`;

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
  [(s) => s.incantations],
  (i) => Object.keys(i)
);

export const useIncantationNames = () => useAppSelector(selectIncantationNames);
