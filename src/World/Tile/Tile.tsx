import { Vec } from "../../types/vec";
import classes from "./Tile.module.css";

type TileProps = {
  id: number;
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

export const Tile = ({ id, pos }: TileProps): React.ReactElement => {
  return (
    <div
      className={"flex-center absolute " + classes.container}
      style={{
        backgroundColor: colors[id],
        top: pos[1] * 64,
        left: pos[0] * 64,
      }}
    ></div>
  );
};
