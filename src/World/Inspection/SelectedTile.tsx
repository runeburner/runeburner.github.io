import { Game } from "../../Game/game";
import { useGameSelector } from "../../store/gameRedux";
import { eq } from "../../types/vec";

const selectInspectedTile = (g: Game): Vec => g.ui.inspectedTile;

export const SelectedTile = (): React.ReactElement => {
  const pos = useGameSelector(selectInspectedTile, eq);

  return (
    <p>
      ({pos[0]}, {pos[1]})
    </p>
  );
};
