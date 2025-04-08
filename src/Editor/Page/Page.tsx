import { useAppSelector } from "../../store/hooks";
import { Editor } from "../Editor/Editor";
import { Header } from "../Header/Header";
import { Picker } from "../Picker/Picker";

export const Page = (): React.ReactElement => {
  const hasIncantationOpen = useAppSelector(
    (s) => s.monacoModels.selected !== -1
  );

  return (
    <div className={"h-full flex flex-col"}>
      <Header />

      {hasIncantationOpen ? (
        <div style={{ height: "100%", width: "100%" }}>
          <Editor />
        </div>
      ) : (
        <Picker />
      )}
    </div>
  );
};
