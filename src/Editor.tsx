import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { store } from "./store/store";
// monaco.languages.typescript.typescriptDefaults.addExtraLib(
//   `declare global {
//   const world = {
//     ping(): Promise<string>;
//   }
// }`
// );
export const Editor = () => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (monacoRef) {
      setEditor((editor) => {
        if (editor) return editor;
        const monacoModels = store.getState().monacoModels;
        const selected = monacoModels.selected;

        if (selected !== -1) {
          return monaco.editor.create(monacoRef.current!, {
            model: monaco.editor.createModel(
              monacoModels.incantations[selected].content,
              "typescript"
            ),
            language: "typescript",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 20,
          });
        }
        return monaco.editor.create(monacoRef.current!, {
          value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
            "\n"
          ),
          language: "typescript",
          theme: "vs-dark",
          automaticLayout: true,
          fontSize: 20,
        });
      });
    }

    return () => editor?.dispose();
  }, [monacoRef, editor]);

  return <div style={{ height: "100%", width: "100%" }} ref={monacoRef}></div>;
};
