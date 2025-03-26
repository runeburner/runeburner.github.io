import { useTranslation } from "react-i18next";
import { game } from "../../Game/game";
import { useInspectedTile } from "../../store/inspection";
import { Offset } from "../../types/map";
import { Tile } from "../../types/tile";
import { AddGolem } from "../AddGolem/AddGolem";
import classes from "./Inspection.module.css";

type TileProps = {
  pos: Vec;
};
const Details = ({ pos }: TileProps): React.ReactElement => {
  const { t } = useTranslation();
  if (pos[0] < 0) return <></>;
  const data = game.tileAt(pos);
  return (
    <>
      <p>{t("inspection.title")}:</p>
      <p>{data[Offset.TILE_ID] === Tile.RUNE_CRYSTAL ? "RUNE_CRYSTAL" : ""}</p>
      <p>
        {t("inspection.quantity")}: {data[Offset.DATA_0]}
      </p>
      <p>
        {t("inspection.hardness")}: {data[Offset.DATA_1]}
      </p>
    </>
  );
};

export const Inspection = (): React.ReactElement => {
  const tile = useInspectedTile();
  return (
    <div className={"m-4 p-2 fixed " + classes.container}>
      <Details pos={tile} />
      <AddGolem />
    </div>
  );
};
