import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export const Page = Object.freeze({
  EDITOR: "EDITOR",
  WORLD: "WORLD",
  PERKS: "PERKS",
  SETTINGS: "SETTINGS",
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

export const useIsPageSelected = (page: Page): boolean =>
  useAppSelector((s) => s.sidebar.selected === page);
