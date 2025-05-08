import { useTranslation } from "react-i18next";
import { Game } from "../../Game/game";
import { useGameSelector } from "../../store/gameRedux";
import { eq } from "../../types/vec";
import { Offset, ValuesPerTile } from "../../types/map";

const tileEq = (a: Int32Array, b: Int32Array): boolean => {
  for (let i = 0; i < ValuesPerTile; i++) {
    if (a[i] != b[i]) {
      return false;
    }
  }
  return true;
};

const selectInspectedTile = (g: Game): Vec => g.ui.inspectedTile;
const selectTile = (g: Game): Int32Array => g.tileAt(g.ui.inspectedTile);

export const TileDetails = (): React.ReactElement => {
  const { t } = useTranslation();
  const pos = useGameSelector(selectInspectedTile, eq);
  const tileData = useGameSelector(selectTile, tileEq);

  return (
    <div>
      <p>
        ({pos[0]}, {pos[1]})
      </p>
      <p>{t("tile." + tileData[Offset.TILE_ID])}</p>
      <p>
        {t("inspection.quantity")}: {tileData[Offset.DATA_0]}
      </p>
      <p>
        {t("inspection.hardness")}: {tileData[Offset.DATA_1]}
      </p>
    </div>
  );
};
