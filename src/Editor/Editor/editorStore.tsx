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
  rename(oldName: string, newName: string): void;
  size(): number;
};

export const iTextModelStore = ((): ITextModelStore => {
  const models: Map<string, monaco.editor.ITextModel> = new Map();
  return {
    size(): number {
      return models.size;
    },
    add(name: string, model: monaco.editor.ITextModel): void {
      models.set(name, model);
    },
    remove(name: string): void {
      models.delete(name);
    },
    get(name: string): monaco.editor.ITextModel | undefined {
      return models.get(name);
    },
    rename(oldName: string, newName: string): void {
      const oldModel = models.get(oldName);
      if (!oldModel) return;
      models.set(newName, oldModel);
      models.delete(oldName);
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
    const forceLayout = iTextModelStore.size() === 0;
    if (selectedModelName === "") {
      editor.setModel(null);
    }
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

    if (forceLayout) {
      editor.layout({
        width: 0,
        height: 0,
      });
    }
  }, [editor, selectedModelName]);
};
