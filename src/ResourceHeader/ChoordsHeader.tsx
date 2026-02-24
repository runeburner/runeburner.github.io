import { useGameSelector } from "../store/gameRedux";
import { MusicIcon } from "../icons";
import { Game } from "../Game/game";

const selectChoords = (g: Game): number => g.choords;

export const ChoordsHeader = (): React.ReactElement => {
  const choords = useGameSelector(selectChoords);
  return (
    <>
      <span className="mx-2">{choords}</span>
      <MusicIcon style={{ height: "24px", width: "24px" }} />
    </>
  );
};
