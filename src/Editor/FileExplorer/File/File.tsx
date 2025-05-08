import classes from "./File.module.css";
import { SettingsIcon } from "../../../icons";
import { loadModel } from "../../../store/monacoModels";
import { store } from "../../../store/store";
import { useAppDispatch } from "../../../store/hooks";
import { useState } from "react";
import { FileSettingsModal } from "../FileSettingsModal/FileSettingsModal";

type FileProps = {
  name: string;
};
export const File = ({ name }: FileProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const onIncantationClicked = (name: string): void => {
    dispatch(
      loadModel({
        name: name,
        content: store.getState().incantations[name],
        isDirty: false,
      })
    );
  };

  const onSettingsClick = (e: React.MouseEvent): void => {
    setOpen(true);
    e.stopPropagation();
  };

  return (
    <>
      <li
        className={`px-3 py-1 ${classes.item}`}
        onClick={() => onIncantationClicked(name)}
      >
        <span className="flex">
          <SettingsIcon
            onClick={onSettingsClick}
            className={`${classes.settings} px-2`}
          />
          <span>{name}</span>
        </span>
      </li>
      {open && (
        <FileSettingsModal
          name={name}
          open={open}
          onClose={() => setOpen(false)}
        ></FileSettingsModal>
      )}
    </>
  );
};
