import { useRef, useEffect, useState } from "react";
import { createNewEditor } from "./utils";
import { useSubscribeModelChange } from "./editorStore";
import "./userWorker";
import { useSubscribeSettingsChange } from "../EditorSettings";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

// https://microsoft.github.io/monaco-editor/typedoc/index.html

export const Editor = (): React.ReactElement => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<HTMLDivElement | null>(null);

  useSubscribeModelChange(editor);
  useSubscribeSettingsChange(editor);

  useEffect(() => {
    if (!monacoRef.current || editor) return;
    setEditor(createNewEditor(monacoRef));
  }, [monacoRef, editor, setEditor]);

  return <div className={"h-full"} ref={monacoRef} />;
};
