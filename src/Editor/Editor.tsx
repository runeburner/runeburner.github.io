import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { store } from "../store/store";
import { saveIncantation } from "../store/incantations";
import { setCurrentModelDirty } from "../store/monacoModels";
import { useAppSelector } from "../store/hooks";

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

  useEffect(() => {
    if (!editor) return;
    models[currentIncantationName.current] = editor.getModel();
    if (models[selectedIncantationName]) {
      editor.setModel(models[selectedIncantationName]);
    } else {
      editor.setModel(monaco.editor.createModel("", "typescript"));
    }
    currentIncantationName.current = selectedIncantationName;
  }, [editor, selectedIncantationName]);

  // useEffect(() => {
  //   document.addEventListener("keydown", (e) => {
  //     if (e.key === "s" && e.ctrlKey && e.metaKey) {
  //       console.log(e);
  //       e.preventDefault();
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (monacoRef) {
      setEditor((editor) => {
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
            fontSize: 20,
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
            fontSize: 20,
          });
        }
        newEditor.onDidChangeModelContent(() => {
          store.dispatch(setCurrentModelDirty());
        });

        newEditor.addAction({
          id: "runeburner-save-incantation",
          label: "Save Incantation",
          run() {
            if (selected === -1) return;
            const content = newEditor.getValue();
            if (!content) return;
            store.dispatch(
              saveIncantation({
                name: monacoModels.incantations[monacoModels.selected].name,
                content: content,
              })
            );
          },
        });
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare const world: {
  ping(): Promise<string>;
};
`
        );

        newEditor.addCommand(
          monaco.KeyCode.KeyS | monaco.KeyMod.CtrlCmd,
          () => {
            console.log("save");
          }
        );

        const firstIncantationName =
          monacoModels.incantations[monacoModels.selected].name;
        models[firstIncantationName] = newEditor.getModel();
        currentIncantationName.current = firstIncantationName;
        return newEditor;
      });
    }

    return () => editor?.dispose();
  }, [monacoRef, editor]);

  return (
    <>
      <div style={{ height: "100%", width: "100%" }} ref={monacoRef} />
    </>
  );
};
