import { createContext, useContext } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const editorContext = createContext<
  [
    monaco.editor.IStandaloneCodeEditor | null,
    React.Dispatch<monaco.editor.IStandaloneCodeEditor | null>
  ]
>([null, (): void => {}]);

export const useEditor = (): [
  monaco.editor.IStandaloneCodeEditor | null,
  React.Dispatch<monaco.editor.IStandaloneCodeEditor | null>
] => useContext(editorContext);

export const EditorProvider = editorContext.Provider;
