import { game } from "../../Game/game";
import { Offset, ValuesPerTile } from "../../types/map";
import classes from "./Tile.module.css";

type TileProps = {
  x: number;
  y: number;
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

export const Tile = ({ x, y }: TileProps): React.ReactElement => {
  const tileID =
    game.map.data[
      (y * game.map.bounds[2] + x) * ValuesPerTile + Offset.TILE_ID
    ];
  const fow =
    game.map.data[
      (y * game.map.bounds[2] + x) * ValuesPerTile + Offset.FOG_OF_WAR
    ];
  return (
    <div
      className={"flex-center absolute " + classes.container}
      style={{
        backgroundColor: fow ? colors[game.map.data[tileID]] : "#00000000",
        top: y * 64,
        left: x * 64,
      }}
    ></div>
  );
};
