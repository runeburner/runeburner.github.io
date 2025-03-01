import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { createNewEditor } from "./utils";
import { useSubscribeModelChange } from "./editorStore";
import "./userWorker";

// https://microsoft.github.io/monaco-editor/typedoc/index.html

export const Editor = (): React.ReactElement => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<HTMLDivElement | null>(null);

  useSubscribeModelChange(editor);

  useEffect(() => {
    if (!monacoRef.current || editor) return;
    setEditor(createNewEditor(monacoRef));
  }, [monacoRef, editor]);

  return <div className={"h-full"} ref={monacoRef} />;
};
