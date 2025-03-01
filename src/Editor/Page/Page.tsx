import { Editor } from "../Editor/Editor";
import { Header } from "../Header/Header";

export const Page = (): React.ReactElement => {
  return (
    <div className={"h-full flex flex-col"}>
      <Header />

      <div style={{ height: "100%", width: "100%", backgroundColor: "red" }}>
        <Editor />
      </div>
    </div>
  );
};
