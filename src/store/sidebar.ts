import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useAppSelector } from "./hooks";

export type Tab = "INCANTATIONS" | "EDITOR" | "WORLD";

interface SidebarState {
  selected: Tab;
}

const initialState: SidebarState = {
  selected: "INCANTATIONS",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    changeTab: (state, action: PayloadAction<Tab>) => {
      state.selected = action.payload;
    },
  },
});

export const { changeTab } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;

export const useTab = () => useAppSelector((s) => s.sidebar);

export const useIsTabSelected = (tab: Tab) =>
  useAppSelector((s) => s.sidebar.selected === tab);
