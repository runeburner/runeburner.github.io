import { useCallback } from "react";
import { melodies, Melody } from "../../Game/Melodies/Melodies";
import { useGameSelector } from "../../store/gameRedux";
import classes from "./Links.module.css";
import { Game } from "../../Game/game";

const pairs = ((): [Melody, Melody][] => {
  const pairs: [Melody, Melody][] = [];
  for (const melody of melodies) {
    if (melody.require !== undefined) {
      const other = melodies.find((m) => m.id === melody.require);
      if (other === undefined) {
        throw new Error(
          `${melody.id} has requirement ${melody.require} which does not exist`
        );
      }
      pairs.push([melody, other] as const);
    }
  }

  return pairs;
})();

const minX = melodies.reduce((acc, m) => (acc < m.x ? acc : m.x), Infinity);
const minY = melodies.reduce((acc, m) => (acc < m.y ? acc : m.y), Infinity);
const maxX = melodies.reduce((acc, m) => (acc > m.x ? acc : m.x), -Infinity);
const maxY = melodies.reduce((acc, m) => (acc > m.y ? acc : m.y), -Infinity);

type LinkProps = {
  pair: [Melody, Melody];
};

const Link = ({ pair }: LinkProps): React.ReactElement => {
  const hasPrerequisite = useGameSelector(
    useCallback((g: Game) => g.melodies[pair[1].id], [pair])
  );
  const x0 = pair[0].x + 32;
  const y0 = pair[0].y + 32;

  const x1 = pair[1].x + 32;
  const y1 = pair[1].y + 32;

  return (
    <path
      className={
        hasPrerequisite ? classes.pathAvailable : classes.pathUnavailable
      }
      d={`M${x0},${y0} L${x1},${y1}`}
    />
  );
};

export const Links = (): React.ReactElement => {
  const width = maxX - minX + 64;
  const height = maxY - minY + 64;
  const viewbox = `${minX} ${minY} ${width} ${height}`;
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewbox}
      className="absolute"
      style={{ left: minX, top: minY }}
    >
      {pairs.map((p, i) => (
        <Link key={i} pair={p} />
      ))}
    </svg>
  );
};
