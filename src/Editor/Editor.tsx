import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { store } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { setupMonacoEditor } from "./utils";

// https://microsoft.github.io/monaco-editor/typedoc/index.html

const models: Record<string, monaco.editor.ITextModel | null> = {};

export const Editor = (): React.ReactElement => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<HTMLDivElement | null>(null);
  const selectedIncantationName = useAppSelector(
    (s) => s.monacoModels.incantations[s.monacoModels.selected]?.name ?? ""
  );
  const currentIncantationName = useRef("");

  useEffect((): void => {
    if (!editor) return;
    models[currentIncantationName.current] = editor.getModel();
    if (models[selectedIncantationName]) {
      editor.setModel(models[selectedIncantationName]);
    } else {
      editor.setModel(monaco.editor.createModel("", "typescript"));
    }
    currentIncantationName.current = selectedIncantationName;
  }, [editor, selectedIncantationName]);

  useEffect(() => {
    if (monacoRef) {
      setEditor((editor): monaco.editor.IStandaloneCodeEditor => {
        if (editor) return editor;
        const monacoModels = store.getState().monacoModels;
        const selected = monacoModels.selected;

        let newEditor: monaco.editor.IStandaloneCodeEditor;
        if (selected !== -1) {
          newEditor = monaco.editor.create(monacoRef.current!, {
            model: monaco.editor.createModel(
              monacoModels.incantations[selected].content,
              "typescript"
            ),
            language: "typescript",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 26,
          });
        } else {
          newEditor = monaco.editor.create(monacoRef.current!, {
            value: [
              "function x() {",
              '\tconsole.log("Hello world!");',
              "}",
            ].join("\n"),
            language: "typescript",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 26,
          });
        }

        setupMonacoEditor(newEditor, currentIncantationName);

        const firstIncantationName =
          monacoModels.incantations[monacoModels.selected].name;
        models[firstIncantationName] = newEditor.getModel();
        currentIncantationName.current = firstIncantationName;
        return newEditor;
      });
    }

    return () => editor?.dispose();
  }, [monacoRef, editor]);

  return <div style={{ height: "100%" }} ref={monacoRef} />;
};
