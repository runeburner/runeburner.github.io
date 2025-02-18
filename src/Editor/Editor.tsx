import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { store } from "../store/store";
import { saveIncantation } from "../store/incantations";
import {
  selectModel,
  setCurrentModelClean,
  setCurrentModelDirty,
} from "../store/monacoModels";
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

  const selected = useAppSelector((s) => s.monacoModels.selected);
  console.log(`editor selected ${selected}`);
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

        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          `declare const world: {
  ping(): Promise<string>;
};
`
        );

        newEditor.addCommand(
          monaco.KeyCode.KeyS | monaco.KeyMod.CtrlCmd,
          () => {
            store.dispatch(
              saveIncantation({
                name: currentIncantationName.current,
                content: newEditor.getValue(),
              })
            );
            store.dispatch(setCurrentModelClean());
          }
        );

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
          newEditor.addCommand(digitKeys[i] | monaco.KeyMod.CtrlCmd, () => {
            store.dispatch(selectModel(i));
          });
        }
        newEditor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP,
          () => {
            newEditor.trigger("", "editor.action.quickCommand", null);
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
