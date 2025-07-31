import { useRef, useEffect } from "react";
import { createNewEditor } from "./utils";
import { useSubscribeModelChange } from "./editorStore";
import "./userWorker";
import { useEditor } from "../FileExplorer/EditorContext";

// https://microsoft.github.io/monaco-editor/typedoc/index.html

export const Editor = (): React.ReactElement => {
  const [editor, setEditor] = useEditor();
  const monacoRef = useRef<HTMLDivElement | null>(null);

  useSubscribeModelChange(editor);

  useEffect(() => {
    if (!monacoRef.current || editor) return;
    setEditor(createNewEditor(monacoRef));
  }, [monacoRef, editor, setEditor]);

  return <div className={"h-full"} ref={monacoRef} />;
};
