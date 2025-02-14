import { useAppSelector } from "../../store/hooks";
import { Tab } from "../Tab/Tab";
import classes from "./Header.module.css";

export const Header = (): React.ReactElement => {
  const tabCount = useAppSelector((s) => s.monacoModels.incantations.length);

  return (
    <div className={classes.header}>
      {new Array(tabCount).fill(0).map((_, i) => (
        <Tab key={i} i={i} />
      ))}
    </div>
  );
};
