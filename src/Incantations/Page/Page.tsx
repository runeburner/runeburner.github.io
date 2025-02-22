import { Create } from "../Create/Create";
import { List } from "../List/List";
import classes from "./Page.module.css";

export const Page = () => {
  return (
    <div className={classes.container}>
      <List />
      <Create />
    </div>
  );
};
