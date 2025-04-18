import { useTranslation } from "react-i18next";
import { Game } from "../../Game/game";
import { Offset, ValuesPerTile } from "../../types/map";
import { AddGolem } from "../AddGolem/AddGolem";
import classes from "./Inspection.module.css";
import { useGameSelector } from "../../store/gameRedux";
import { eq } from "../../types/vec";

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

const Details = (): React.ReactElement => {
  const { t } = useTranslation();
  // const tileData = useGameSelector(selectTile, tileEq);
  const tileData = [0, 0, 0, 0];

  const pos = useGameSelector(selectInspectedTile, eq);

  console.log(pos, tileData);
  return (
    <div style={{ color: "var(--container-primary)" }}>
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

export const Inspection = (): React.ReactElement => {
  return (
    <div className={"m-4 p-2 fixed " + classes.container}>
      <Details />
      <div className="w-full flex justify-end">
        <AddGolem />
      </div>
    </div>
  );
};
