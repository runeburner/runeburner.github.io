import { Create } from "../Create/Create";
import { useIsTabSelected } from "../../store/sidebar";
import { List } from "../List/List";
import classes from "./Page.module.css";

export const Page = () => {
  const is = useIsTabSelected("INCANTATIONS");
  if (!is) return <></>;
  return (
    <div className={classes.container}>
      <List />
      <Create />
    </div>
  );
};
