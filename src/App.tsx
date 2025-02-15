import { Page as EditorPage } from "./Editor/Page/Page";
import { Page as IncantationsPage } from "./Incantations/Page/Page";
import { Sidebar } from "./Sidebar/Sidebar";
import { WorldPage } from "./WorldPage";
import classes from "./App.module.css";
import { useEffect } from "react";
import { Page as PerksPage } from "./Perks/Page/Page";

function App() {
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;
      if (isMeta && ["p"].includes(e.key)) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, []);
  return (
    <div className={classes.fullscreenContainer}>
      <Sidebar />
      <div className={classes.pageContainer}>
        <EditorPage />
        <IncantationsPage />
        <WorldPage />
        <PerksPage />
      </div>
    </div>
  );
}

export default App;
