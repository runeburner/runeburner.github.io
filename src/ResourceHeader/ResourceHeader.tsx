import { Game } from "../Game/game";
import { MagicIcon } from "../icons";
import { useGameSelector } from "../store/gameRedux";
import classes from "./ResourceHeader.module.css";

const selectAttunement = (g: Game): number => g.resources.attunement;

export const ResourceHeader = (): React.ReactElement => {
  const attunement = 0; //useGameSelector(selectAttunement);
  return (
    <div className={"py-2 flex-center w-full " + classes.container}>
      <span>{attunement}</span>
      <MagicIcon style={{ height: "24px", width: "24px" }} />
    </div>
  );
};
