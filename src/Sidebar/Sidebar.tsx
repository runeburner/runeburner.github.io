import { ReactElement } from "react";
import { changeTab, Tab, useIsTabSelected } from "../store/sidebar";
import "./Sidebar.css";
import { useAppDispatch } from "../store/hooks";

interface SidebarTabProps {
  tab: Tab;
}

const SidebarTab = ({ tab }: SidebarTabProps): ReactElement => {
  const isSelected = useIsTabSelected(tab);
  const dispatch = useAppDispatch();
  return (
    <li
      className={"li " + (isSelected ? "selected" : "")}
      onClick={() => dispatch(changeTab(tab))}
    >
      {tab}
    </li>
  );
};

export const Sidebar = () => {
  return (
    <ul className="ul">
      <SidebarTab tab="INCANTATIONS" />
      <SidebarTab tab="EDITOR" />
      <SidebarTab tab="WORLD" />
    </ul>
  );
};
