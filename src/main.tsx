import { createRoot } from "react-dom/client";
import { App } from "./App/App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import "./Game/worker";
import "./i18n/i18n.ts";
import "./styles";
import { I18NPicker } from "./i18n/I18NPicker.tsx";

((): void => {
  const rootDiv = document.getElementById("root");
  if (!rootDiv) {
    console.error("div with id 'root' not found");
    return;
  }
  createRoot(rootDiv).render(
    <Provider store={store}>
      <I18NPicker />
      <App />
    </Provider>
  );
})();
