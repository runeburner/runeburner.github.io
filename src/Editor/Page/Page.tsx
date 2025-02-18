import classes from "./Page.module.css";
import { Editor } from "../Editor/Editor";
import { Header } from "../Header/Header";

export const Page = (): React.ReactElement => {
  return (
    <div className={classes.container}>
      <Header />
      <Editor />
    </div>
  );
};
