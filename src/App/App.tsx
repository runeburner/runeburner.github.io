import { Page as EditorPage } from "../Editor/Page/Page";
import { Sidebar } from "../Sidebar/Sidebar";
import { Page as WorldPage } from "../World/Page/Page";
import { useEffect } from "react";
import { Page as MelodyPage } from "../Melody/Page/Page";
import { Page as SettingsPage } from "../Settings/Page";
import { PageWrapper } from "../PageWrapper/PageWrapper";
import { Page } from "../store/sidebar";
import { ResourceHeader } from "../ResourceHeader/ResourceHeader";
import { HelpPage } from "../Manual/Page";
import { YggdrasilPage } from "../Yggdrasil/Page";
import { StatsPage } from "../Stats/Page";

export const App = (): React.ReactElement => {
  useEffect(() => {
    const f = (e: KeyboardEvent): void => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && ["p"].includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", f);
    return (): void => document.removeEventListener("keydown", f);
  }, []);

  return (
    <div className={"w-screen h-screen flex flex-col"}>
      <ResourceHeader />
      <div className={"w-full h-full flex flex-row"}>
        <Sidebar />
        <div className={"w-full h-full"}>
          <PageWrapper page={Page.EDITOR}>
            <EditorPage />
          </PageWrapper>
          <PageWrapper page={Page.WORLD}>
            <WorldPage />
          </PageWrapper>
          <PageWrapper page={Page.MELODY}>
            <MelodyPage />
          </PageWrapper>
          <PageWrapper page={Page.HELP}>
            <HelpPage />
          </PageWrapper>
          <PageWrapper page={Page.SETTINGS}>
            <SettingsPage />
          </PageWrapper>
          <PageWrapper page={Page.STATS}>
            <StatsPage />
          </PageWrapper>
          <PageWrapper page={Page.YGGDRASIL}>
            <YggdrasilPage />
          </PageWrapper>
        </div>
      </div>
    </div>
  );
};
