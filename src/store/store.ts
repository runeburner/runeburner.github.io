import { configureStore } from "@reduxjs/toolkit";
import { sidebarReducer } from "./sidebar";
import { incantationReducer } from "./incantations";
import { monacoModelsReducer } from "./monacoModels";
import { inspectionReducer } from "./inspection";
import { manualReducer } from "./manual";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    incantations: incantationReducer,
    monacoModels: monacoModelsReducer,
    inspection: inspectionReducer,
    manual: manualReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
