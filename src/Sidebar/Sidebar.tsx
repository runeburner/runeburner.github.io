import { ReactElement } from "react";
import { changePage, Page, useIsPageSelected } from "../store/sidebar";
import classes from "./Sidebar.module.css";
import { useAppDispatch } from "../store/hooks";
import {
  FeatherIcon,
  BookIcon,
  MapIcon,
  SettingsIcon,
  MusicIcon,
  TreeIcon,
} from "../icons";
import { useTranslation } from "react-i18next";

type SidebarTabProps = {
  page: Page;
  icon: typeof FeatherIcon;
  disabled?: boolean;
};

const SidebarTab = ({
  page,
  icon: Icon,
  disabled,
}: SidebarTabProps): ReactElement => {
  const { t } = useTranslation();
  const isSelected = useIsPageSelected(page);
  const dispatch = useAppDispatch();

  return (
    <li
      className={
        "p-4 select-none cursor-pointer flex flex-col items-center " +
        classes.li +
        " " +
        (isSelected ? classes.selected : "")
      }
      onClick={() => !disabled && dispatch(changePage(page))}
    >
      <Icon style={{ width: "32px" }} />
      <span className="mt-1">{t(`tab.${page}`)}</span>
    </li>
  );
};

export const Sidebar = (): React.ReactElement => {
  return (
    <ul className={"p-0 " + classes.ul}>
      <SidebarTab page={Page.EDITOR} icon={FeatherIcon} />
      <SidebarTab page={Page.WORLD} icon={MapIcon} />
      <SidebarTab page={Page.MELODY} icon={MusicIcon} />
      <SidebarTab page={Page.YGGDRASIL} icon={TreeIcon} />
      <SidebarTab page={Page.HELP} icon={BookIcon} />
      <SidebarTab page={Page.SETTINGS} icon={SettingsIcon} />
    </ul>
  );
};
