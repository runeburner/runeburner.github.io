import { Game } from "../Game/game";
import { NoteIcon } from "../icons";
import { useGameSelector } from "../store/gameRedux";
import classes from "./ResourceHeader.module.css";

const selectMusicalNotes = (g: Game): number => g.resources.musicalNotes;

export const ResourceHeader = (): React.ReactElement => {
  const musicalNotes = useGameSelector(selectMusicalNotes);
  return (
    <div className={"py-2 flex-center w-full " + classes.container}>
      <span>{musicalNotes}</span>
      <NoteIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
