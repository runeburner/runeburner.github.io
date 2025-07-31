import { Editor } from "../Editor/Editor";
import { FileExplorer } from "../FileExplorer/FileExplorer";
import { Header } from "../Header/Header";

export const Page = (): React.ReactElement => {
  return (
    <div className="h-full flex">
      <FileExplorer />
      <div className={"w-full flex flex-col"}>
        <Header />
        <Editor />
      </div>
    </div>
  );
};
