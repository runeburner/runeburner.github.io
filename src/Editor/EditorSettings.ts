import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useEffect } from "react";

const LOCAL_STORAGE_KEY = "RUNEBURNER_EDITOR_SETTINGS";

type EditorOptions = monaco.editor.IEditorOptions &
  monaco.editor.IGlobalEditorOptions &
  Required<{ fontSize: number; theme: string }>;

const defaultOptions: EditorOptions = {
  fontSize: 20,
  theme: "vs-dark",
} as const;

const loadOptions = (): EditorOptions => {
  const ls = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (ls === null || ls === "") return defaultOptions;
  const opts = JSON.parse(ls);
  if (typeof opts !== "object") return defaultOptions;
  return opts;
};

let onChange: (() => void) | undefined;

export const EditorSettings = loadOptions();

export const useSubscribeSettingsChange = (
  editor: monaco.editor.IStandaloneCodeEditor | null
): void => {
  useEffect(() => {
    if (!editor) return;
    onChange = (): void => {
      editor.updateOptions(EditorSettings);
    };
    return (): void => {
      onChange = undefined;
    };
  }, [editor]);
};

export const updateEditorOptions = (options: Partial<EditorOptions>): void => {
  Object.assign(EditorSettings, options);
  onChange?.();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(EditorSettings));
};
