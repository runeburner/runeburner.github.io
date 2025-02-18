import { createRoot } from "react-dom/client";
import App from "./App/App.tsx";
import "./userWorker";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

(() => {
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
