import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export type Page = "INCANTATIONS" | "EDITOR" | "WORLD" | "PERKS";

interface SidebarState {
  selected: Page;
}

const initialState: SidebarState = {
  selected: "INCANTATIONS",
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
