import { Editor } from "./Editor";
import { useIsTabSelected } from "./store/sidebar";

export const EditorPage = () => {
  const is = useIsTabSelected("EDITOR");
  if (!is) return <></>;
  return <Editor />;
};
