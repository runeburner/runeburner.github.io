import { Page as EditorPage } from "./Editor/Page/Page";
import { IncantationsPage } from "./IncantationsPage";
import { Sidebar } from "./Sidebar/Sidebar";
import { WorldPage } from "./WorldPage";
import classes from "./App.module.css";

function App() {
  return (
    <div className={classes.fullscreenContainer}>
      <Sidebar />
      <div className={classes.pageContainer}>
        <EditorPage />
        <IncantationsPage />
        <WorldPage />
      </div>
    </div>
  );
}

export default App;
