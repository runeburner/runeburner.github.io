import { useState } from "react";
import { Editor } from "../Editor/Editor";
import { EditorProvider } from "../FileExplorer/EditorContext";
import { FileExplorer } from "../FileExplorer/FileExplorer";
import { Header } from "../Header/Header";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export const Page = (): React.ReactElement => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  return (
    <div className="h-full flex">
      <EditorProvider value={[editor, setEditor]}>
        <FileExplorer />
        <div className={"w-full flex flex-col"}>
          <Header />
          <Editor />
        </div>
      </EditorProvider>
    </div>
  );
};
