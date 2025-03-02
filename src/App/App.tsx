import { Page as EditorPage } from "../Editor/Page/Page";
import { Page as IncantationsPage } from "../Incantations/Page/Page";
import { Sidebar } from "../Sidebar/Sidebar";
import { Page as WorldPage } from "../World/Page/Page";
import { useEffect } from "react";
import { Page as PerksPage } from "../Perks/Page/Page";
import { Page as SettingsPage } from "../Settings/Page";
import { PageWrapper } from "../PageWrapper/PageWrapper";
import { Page } from "../store/sidebar";
import { GameReadyGate } from "../World/GameReadyGate";
import { ResourceHeader } from "../ResourceHeader/ResourceHeader";

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
          <PageWrapper page={Page.INCANTATIONS}>
            <IncantationsPage />
          </PageWrapper>
          <PageWrapper page={Page.WORLD}>
            <GameReadyGate>
              <WorldPage />
            </GameReadyGate>
          </PageWrapper>
          <PageWrapper page={Page.PERKS}>
            <PerksPage />
          </PageWrapper>
          <PageWrapper page={Page.SETTINGS}>
            <SettingsPage />
          </PageWrapper>
        </div>
      </div>
    </div>
  );
};
