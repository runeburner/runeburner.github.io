import { EditorPage } from "./EditorPage";
import { IncantationsPage } from "./IncantationsPage";
import { Sidebar } from "./Sidebar/Sidebar";
import { WorldPage } from "./WorldPage";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex" }}>
      <Sidebar />
      <div style={{ width: "100%", height: "100%" }}>
        <EditorPage />
        <IncantationsPage />
        <WorldPage />
      </div>
    </div>
  );
}

export default App;
