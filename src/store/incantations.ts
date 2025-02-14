import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

type IncantationsState = Record<string, string>;

export const defaultIncantation = `(async () => {
  while(true) {
    const pong = await world.ping();
    console.log(pong);
  }
})();
`;

const initialState: IncantationsState = {
  basic: defaultIncantation,
};

export interface Incantation {
  name: string;
  content: string;
}

const incantationsSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    saveIncantation: (state, action: PayloadAction<Incantation>) => {
      state[action.payload.name] = action.payload.content;
    },
  },
});

export const { saveIncantation } = incantationsSlice.actions;
export const incantationReducer = incantationsSlice.reducer;

export const selectIncantationNames = createSelector(
  [(s) => s.incantations],
  (i) => Object.keys(i)
);

export const useIncantationNames = () => useAppSelector(selectIncantationNames);
