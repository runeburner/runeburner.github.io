import { ReactElement } from "react";
import { changePage, Page, useIsPageSelected } from "../store/sidebar";
import classes from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { BookIcon, EditIcon, MapIcon, SettingsIcon, ShareIcon } from "../icons";

type SidebarTabProps = {
  page: Page;
  icon: typeof EditIcon;
  disabled?: boolean;
};

const SidebarTab = ({
  page,
  icon: Icon,
  disabled,
}: SidebarTabProps): ReactElement => {
  const isSelected = useIsPageSelected(page);
  const dispatch = useAppDispatch();

  return (
    <li
      className={classes.li + " " + (isSelected ? classes.selected : "")}
      onClick={() => !disabled && dispatch(changePage(page))}
    >
      <Icon />
    </li>
  );
};

export const Sidebar = (): React.ReactElement => {
  const editorDisabled = useAppSelector((s) => s.monacoModels.selected === -1);

  return (
    <ul className={classes.ul}>
      <SidebarTab page={Page.INCANTATIONS} icon={BookIcon} />
      <SidebarTab
        page={Page.EDITOR}
        icon={EditIcon}
        disabled={editorDisabled}
      />
      <SidebarTab page={Page.WORLD} icon={MapIcon} />
      <SidebarTab page={Page.PERKS} icon={ShareIcon} />
      <SidebarTab page={Page.SETTINGS} icon={SettingsIcon} />
    </ul>
  );
};
