import { Offset } from "../../types/map";
import { Vec } from "../../types/vec";
import classes from "./Tile.module.css";

type TileProps = {
  data: Int32Array;
  pos: Vec;
};
const colors = [
  "#a2b9bc",
  "#b2ad7f",
  "#878f99",
  "#6b5b95",
  "#6b5b95",
  "#feb236",
  "#d64161",
  "#ff7b25",
  "#e3eaa7",
];

export const Tile = ({ data, pos }: TileProps): React.ReactElement => {
  return (
    <div
      className={"flex-center absolute " + classes.container}
      style={{
        backgroundColor: data[Offset.FOG_OF_WAR]
          ? colors[data[Offset.TILE_ID]]
          : "#00000000",
        top: pos[1] * 64,
        left: pos[0] * 64,
      }}
    ></div>
  );
};
