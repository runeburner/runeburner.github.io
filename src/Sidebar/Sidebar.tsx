import { ReactElement } from "react";
import { changeTab, Tab, useIsTabSelected } from "../store/sidebar";
import classes from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { BookIcon, EditIcon, MapIcon, ShareIcon } from "../icons";

interface SidebarTabProps {
  tab: Tab;
  icon: typeof EditIcon;
  disabled?: boolean;
}

const SidebarTab = ({
  tab,
  icon: Icon,
  disabled,
}: SidebarTabProps): ReactElement => {
  const isSelected = useIsTabSelected(tab);
  const dispatch = useAppDispatch();

  return (
    <li
      className={classes.li + " " + (isSelected ? classes.selected : "")}
      onClick={() => !disabled && dispatch(changeTab(tab))}
    >
      <Icon />
    </li>
  );
};

export const Sidebar = () => {
  const editorDisabled = useAppSelector((s) => s.monacoModels.selected !== -1);
  return (
    <ul className={classes.ul}>
      <SidebarTab tab="INCANTATIONS" icon={BookIcon} />
      <SidebarTab tab="EDITOR" icon={EditIcon} disabled={editorDisabled} />
      <SidebarTab tab="WORLD" icon={MapIcon} />
      <SidebarTab tab="PERKS" icon={ShareIcon} />
    </ul>
  );
};
