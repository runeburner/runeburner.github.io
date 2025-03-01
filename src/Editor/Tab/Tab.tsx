import classes from "./Tab.module.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeModel, selectModel } from "../../store/monacoModels";
import { CircleIcon, XIcon } from "../../icons";
import { iTextModelStore } from "../Editor/editorStore";
import { store } from "../../store/store";

type TabProps = {
  i: number;
};
export const Tab = ({ i }: TabProps): React.ReactElement => {
  const selected = useAppSelector((s) => s.monacoModels.selected === i);
  const name = useAppSelector((s) => s.monacoModels.incantations[i].name);
  const isDirty = useAppSelector((s) => s.monacoModels.incantations[i].isDirty);
  const dispatch = useAppDispatch();

  const onClose = (e: React.MouseEvent<HTMLImageElement>) => {
    dispatch(closeModel(i));
    const state = store.getState().monacoModels;
    iTextModelStore.remove(state.incantations[state.selected].name);
    e.stopPropagation();
  };

  const onClick = () => dispatch(selectModel(i));
  return (
    <div
      onClick={onClick}
      className={
        "p-3 " + classes.tab + (selected ? " " + classes.selected : "")
      }
    >
      {name}
      {isDirty ? (
        <CircleIcon
          onClick={onClose}
          className={
            "ml-1 p-1 " +
            classes.icon +
            (selected ? " " + classes.iconSelected : "")
          }
        />
      ) : (
        <XIcon
          onClick={onClose}
          className={
            "ml-1 p-1 " +
            classes.icon +
            (selected ? " " + classes.iconSelected : "")
          }
        />
      )}
    </div>
  );
};
