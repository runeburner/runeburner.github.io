import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export const Page = Object.freeze({
  INCANTATIONS: "INCANTATIONS",
  EDITOR: "EDITOR",
  WORLD: "WORLD",
  PERKS: "PERKS",
} as const);

export type Page = (typeof Page)[keyof typeof Page];

type SidebarState = {
  selected: Page;
};

const initialState: SidebarState = {
  selected: Page.WORLD,
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

export const usePage = () => useAppSelector((s) => s.sidebar);

export const useIsPageSelected = (page: Page) =>
  useAppSelector((s) => s.sidebar.selected === page);
