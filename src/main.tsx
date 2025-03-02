import { createRoot } from "react-dom/client";
import { App } from "./App/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import GameWorker from "./Game/worker?worker";
import "./i18n.ts";
import "./styles/vars.css";
import "./styles/cursor.css";
import "./styles/layout/align-items.css";
import "./styles/layout/display.css";
import "./styles/layout/flex.css";
import "./styles/layout/justify-content.css";
import "./styles/layout/margin.css";
import "./styles/layout/overflow.css";
import "./styles/layout/padding.css";
import "./styles/layout/position.css";
import "./styles/layout/size.css";
import "./styles/reset.css";
import "./styles/user-select.css";
import "./styles/theme.css";

((): void => {
  new GameWorker();
  const rootDiv = document.getElementById("root");
  if (!rootDiv) {
    console.error("div with id 'root' not found");
    return;
  }
  createRoot(rootDiv).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
})();
