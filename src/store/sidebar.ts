import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export const Page = Object.freeze({
  EDITOR: "EDITOR",
  WORLD: "WORLD",
  MELODY: "MELODY",
  HELP: "HELP",
  SETTINGS: "SETTINGS",
  YGGDRASIL: "YGGDRASIL",
} as const);

export type Page = (typeof Page)[keyof typeof Page];

type SidebarState = {
  selected: Page;
};

const initialState: SidebarState = {
  selected: Page.YGGDRASIL,
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

export const useIsPageSelected = (page: Page): boolean =>
  useAppSelector((s) => s.sidebar.selected === page);
