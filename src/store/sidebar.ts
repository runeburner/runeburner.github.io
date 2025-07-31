import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const Page = Object.freeze({
  EDITOR: "EDITOR",
  WORLD: "WORLD",
  MELODY: "MELODY",
  HELP: "HELP",
  STATS: "STATS",
  SETTINGS: "SETTINGS",
  YGGDRASIL: "YGGDRASIL",
} as const);

export type Page = (typeof Page)[keyof typeof Page];

type SidebarState = {
  selected: Page;
};

const initialState: SidebarState = {
  selected: Page.EDITOR,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    changePage: (state, action: PayloadAction<Page>) => {
      state.selected = action.payload;
    },
  },
});

export const { changePage } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
