import { createRoot } from "react-dom/client";
import App from "./App/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import GameWorker from "./Game/worker?worker";
import "./i18n.ts";
import "./styles/vars.css";
import "./styles/m.css";
import "./styles/p.css";
import "./styles/reset.css";
import "./styles/flex.css";
import "./styles/size.css";
import "./styles/justify.css";
import "./styles/items.css";
import "./styles/cursor.css";
import "./styles/select.css";
import "./styles/main.module.css";

(() => {
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
