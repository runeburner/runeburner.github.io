import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { store } from "../../store/store";
import {
  selectModel,
  setCurrentModelClean,
  setCurrentModelDirty,
} from "../../store/monacoModels";
import { saveIncantation } from "../../store/incantations";
import apiDefs from "./api.d.ts?raw";

export const createNewEditor = (
  ref: React.MutableRefObject<HTMLDivElement | null>
): monaco.editor.IStandaloneCodeEditor => {
  const editor = monaco.editor.create(ref.current!, {
    model: null,
    language: "typescript",
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 26,
  });

  addLibrary();
  setupCtrlS(editor);
  setupDirtying(editor);
  setupTabSwitch(editor);
  setupCtrlP(editor);

  return editor;
};

// Setup the shortcut ctrl/cmd+s to save the currently selected incantation
const setupCtrlS = (editor: monaco.editor.IStandaloneCodeEditor): void => {
  editor.addCommand(monaco.KeyCode.KeyS | monaco.KeyMod.CtrlCmd, (): void => {
    store.dispatch(
      saveIncantation({
        name: store.getState().monacoModels.incantations[
          store.getState().monacoModels.selected
        ].name,
        content: editor.getValue(),
      })
    );
    store.dispatch(setCurrentModelClean());
  });
};

// Add the game library to the editor intellisense. Also only do it once.
const addLibrary = (() => {
  let once = false;
  return (): void => {
    if (once) return;
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      apiDefs,
      "api.d.ts"
    );
    once = true;
  };
})();

// Add callback so that whenever the model changes it marks the model as "dirty" which
// reminds the user they need to save. The file will be marked as dirty even if changes are undone.
const setupDirtying = (editor: monaco.editor.IStandaloneCodeEditor): void => {
  editor.onDidChangeModelContent((): void => {
    store.dispatch(setCurrentModelDirty());
  });
};

// Setup the shortcut ctrl/cmd+[1-9] to switch between opened tabs
const setupTabSwitch = (editor: monaco.editor.IStandaloneCodeEditor): void => {
  const digitKeys = [
    monaco.KeyCode.Digit1,
    monaco.KeyCode.Digit2,
    monaco.KeyCode.Digit3,
    monaco.KeyCode.Digit4,
    monaco.KeyCode.Digit5,
    monaco.KeyCode.Digit6,
    monaco.KeyCode.Digit7,
    monaco.KeyCode.Digit8,
    monaco.KeyCode.Digit9,
  ];
  for (let i = 0; i < digitKeys.length; i++) {
    editor.addCommand(digitKeys[i] | monaco.KeyMod.CtrlCmd, (): void => {
      store.dispatch(selectModel(i));
    });
  }
};

// Setup the shortcut ctrl/cmd+p to open monaco command panel
const setupCtrlP = (editor: monaco.editor.IStandaloneCodeEditor): void => {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, (): void => {
    editor.trigger("", "editor.action.quickCommand", null);
  });
};
