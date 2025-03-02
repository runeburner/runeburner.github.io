// redux cannot save ITextModel because it's not serializable
// so we will make an adapter to abstract the loading/unloading of models.
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { useAppSelector } from "../../store/hooks";
import { useEffect, useRef } from "react";
import { store } from "../../store/store";

type ITextModelStore = {
  add(name: string, model: monaco.editor.ITextModel): void;
  remove(name: string): void;
  get(name: string): monaco.editor.ITextModel | undefined;
};

export const iTextModelStore = ((): ITextModelStore => {
  const models: Record<string, monaco.editor.ITextModel> = {};
  return {
    add(name: string, model: monaco.editor.ITextModel): void {
      models[name] = model;
    },
    remove(name: string): void {
      delete models[name];
    },
    get(name: string): monaco.editor.ITextModel | undefined {
      return models[name];
    },
  };
})();

export const useSubscribeModelChange = (
  editor: monaco.editor.IStandaloneCodeEditor | null
): void => {
  const selectedModelName = useAppSelector(
    (s) => s.monacoModels.incantations[s.monacoModels.selected]?.name ?? ""
  );
  const loadedModelName = useRef("");

  useEffect(() => {
    if (!editor) return;
    if (loadedModelName.current === selectedModelName) return;
    const storedModel = iTextModelStore.get(selectedModelName);
    if (storedModel) {
      editor.setModel(storedModel);
    } else {
      const content = store.getState().incantations[selectedModelName];
      const newModel = monaco.editor.createModel(content, "typescript");
      iTextModelStore.add(selectedModelName, newModel);
      editor.setModel(newModel);
    }
  }, [editor, selectedModelName]);
};
