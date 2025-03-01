import { useState } from "react";
import { CheckIcon, EditIcon, ItalicIcon, TrashIcon } from "../../../icons";
import { useAppDispatch } from "../../../store/hooks";
import { loadModel } from "../../../store/monacoModels";
import { changePage } from "../../../store/sidebar";
import { store } from "../../../store/store";
import classes from "./Row.module.css";
import { renameIncantation } from "../../../store/incantations";

type RowProps = {
  name: string;
};

export const Row = ({ name }: RowProps) => {
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(name);
  const dispatch = useAppDispatch();

  const onSave = (): void => {
    setRenaming(false);
    dispatch(renameIncantation([name, newName]));
  };

  const onRenaming = (): void => {
    setNewName(name);
    setRenaming(true);
  };

  return (
    <tr key={name}>
      <td>
        {renaming ? (
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        ) : (
          name
        )}
      </td>
      <td>
        {renaming ? (
          <CheckIcon className={classes.icon} onClick={onSave} />
        ) : (
          <ItalicIcon className={classes.icon} onClick={onRenaming} />
        )}
      </td>
      <td>
        <EditIcon
          className={"cursor-pointer block " + classes.icon}
          onClick={() => {
            dispatch(
              loadModel({
                name: name,
                content: store.getState().incantations[name],
                isDirty: false,
              })
            );
            dispatch(changePage("EDITOR"));
          }}
        />
      </td>
      <td>
        <TrashIcon className={classes.icon} />
      </td>
    </tr>
  );
};
