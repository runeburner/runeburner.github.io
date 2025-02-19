import classes from "./Tile.module.css";

interface TileProps {
  id: number;
  x: number;
  y: number;
}
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

export const Tile = ({ id, x, y }: TileProps) => {
  return (
    <div
      className={classes.container}
      style={{ backgroundColor: colors[id], top: y * 64, left: x * 64 }}
    >
      {id}
    </div>
  );
};
