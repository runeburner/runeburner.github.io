import { ReactElement, useCallback } from "react";
import { changePage, Page } from "../store/sidebar";
import classes from "./Sidebar.module.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  FeatherIcon,
  BookIcon,
  MapIcon,
  SettingsIcon,
  // MusicIcon,
  TreeIcon,
  ChartBarIcon,
} from "../icons";
import { useTranslation } from "react-i18next";
import { RootState } from "../store/store";

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
  const isSelected = useAppSelector(
    useCallback((s: RootState) => s.sidebar.selected === page, [page])
  );
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
      {/* <SidebarTab page={Page.MELODY} icon={MusicIcon} /> */}
      <SidebarTab page={Page.YGGDRASIL} icon={TreeIcon} />
      <SidebarTab page={Page.STATS} icon={ChartBarIcon} />
      <SidebarTab page={Page.HELP} icon={BookIcon} />
      <SidebarTab page={Page.SETTINGS} icon={SettingsIcon} />
    </ul>
  );
};
