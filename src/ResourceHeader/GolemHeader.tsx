import { Game } from "../Game/game";
import { PersonStandingIcon } from "../icons";
import { useGameSelector } from "../store/gameRedux";

const selectGolemCount = (g: Game): number => g.resources.golems;
const selectMaxGolemCount = (g: Game): number => g.resources.maxGolems;

export const GolemHeader = (): React.ReactElement => {
  const golemCount = useGameSelector(selectGolemCount);
  const maxGolemCount = useGameSelector(selectMaxGolemCount);
  return (
    <>
      <span className="mx-2">
        {golemCount} / {maxGolemCount}
      </span>
      <PersonStandingIcon style={{ height: "24px", width: "24px" }} />
    </>
  );
};
