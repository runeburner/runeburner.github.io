import { Game } from "../Game/game";
import { HeartIcon } from "../icons";
import { useGameSelector } from "../store/gameRedux";

const selectLivesLeft = (g: Game): number => g.livesLeft;

export const LivesHeader = (): React.ReactElement => {
  const liveLeft = useGameSelector(selectLivesLeft);
  return (
    <>
      <span className="mx-2">{liveLeft}</span>
      <HeartIcon style={{ height: "24px", width: "24px" }} />
    </>
  );
};
