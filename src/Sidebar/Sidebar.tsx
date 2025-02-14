import { ReactElement } from "react";
import { changeTab, Tab, useIsTabSelected } from "../store/sidebar";
import classes from "./Sidebar.module.css";
import { useAppDispatch } from "../store/hooks";
import { EditIcon, FileIcon, MapIcon } from "../icons";

interface SidebarTabProps {
  tab: Tab;
  icon: typeof EditIcon;
}

const SidebarTab = ({ tab, icon: Icon }: SidebarTabProps): ReactElement => {
  const isSelected = useIsTabSelected(tab);
  const dispatch = useAppDispatch();

  return (
    <li
      className={classes.li + " " + (isSelected ? classes.selected : "")}
      onClick={() => dispatch(changeTab(tab))}
    >
      <Icon />
    </li>
  );
};

export const Sidebar = () => {
  return (
    <ul className={classes.ul}>
      <SidebarTab tab="INCANTATIONS" icon={FileIcon} />
      <SidebarTab tab="EDITOR" icon={EditIcon} />
      <SidebarTab tab="WORLD" icon={MapIcon} />
    </ul>
  );
};
