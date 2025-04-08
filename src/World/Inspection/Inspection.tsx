import { useTranslation } from "react-i18next";
import { game } from "../../Game/game";
import { useInspectedTile } from "../../store/inspection";
import { Offset } from "../../types/map";
import { AddGolem } from "../AddGolem/AddGolem";
import classes from "./Inspection.module.css";

type TileProps = {
  pos: Vec;
};
const Details = ({ pos }: TileProps): React.ReactElement => {
  const { t } = useTranslation();
  const data = game.tileAt(pos);
  return (
    <div style={{ color: "var(--container-primary)" }}>
      <p>
        ({pos[0]}, {pos[1]})
      </p>
      <p>{t("tile." + data[Offset.TILE_ID])}</p>
      <p>
        {t("inspection.quantity")}: {data[Offset.DATA_0]}
      </p>
      <p>
        {t("inspection.hardness")}: {data[Offset.DATA_1]}
      </p>
    </div>
  );
};

export const Inspection = (): React.ReactElement => {
  const tile = useInspectedTile();
  return (
    <div className={"m-4 p-2 fixed " + classes.container}>
      <Details pos={tile} />
      <div className="w-full flex justify-end">
        <AddGolem />
      </div>
    </div>
  );
};
