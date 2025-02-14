import classes from "./Page.module.css";
import { useIsTabSelected } from "../../store/sidebar";
import { Editor } from "../Editor";
import { Header } from "../Header/Header";

export const Page = (): React.ReactElement => {
  const is = useIsTabSelected("EDITOR");
  if (!is) return <></>;

  return (
    <div className={classes.container}>
      <Header />
      <Editor />
    </div>
  );
};
