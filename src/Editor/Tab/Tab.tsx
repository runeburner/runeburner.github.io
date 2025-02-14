import classes from "./Tab.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeModel, selectModel } from "../../store/monacoModels";
import { CircleIcon, XIcon } from "../../icons";

interface TabProps {
  i: number;
}
export const Tab = ({ i }: TabProps): React.ReactElement => {
  const selected = useAppSelector((s) => s.monacoModels.selected === i);
  const name = useAppSelector((s) => s.monacoModels.incantations[i].name);
  const isDirty = useAppSelector((s) => s.monacoModels.incantations[i].isDirty);
  const dispatch = useAppDispatch();

  const onClose = (e: React.MouseEvent<HTMLImageElement>) => {
    dispatch(closeModel(i));
    e.stopPropagation();
  };

  const onClick = () => {
    dispatch(selectModel(i));
  };

  return (
    <div
      onClick={onClick}
      className={classes.tab + (selected ? " " + classes.selected : "")}
    >
      {name}
      {isDirty ? (
        <CircleIcon
          onClick={onClose}
          className={
            classes.icon + (selected ? " " + classes.iconSelected : "")
          }
        />
      ) : (
        <XIcon
          onClick={onClose}
          className={
            classes.icon + (selected ? " " + classes.iconSelected : "")
          }
        />
      )}
    </div>
  );
};
