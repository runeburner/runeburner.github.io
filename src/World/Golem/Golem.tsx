import { Rune } from "../../Game/runes";
import { Health } from "./Health/Health";

type ArcProps = {
  start: number;
  end: number;
  rune: Rune;
};

const runeColors = {
  [Rune.VOID]: "#ff000088",
  [Rune.LABOR]: "#0000ff88",
  [Rune.WIND]: "#00ff0088",
};
const Arc = ({ start, end, rune }: ArcProps): React.ReactElement => {
  start *= Math.PI * 2;
  end *= Math.PI * 2;

  const p0 = [Math.sin(start) * 18, Math.cos(start) * 18];
  const p1 = [Math.sin(end) * 18, Math.cos(end) * 18];
  const large = end - start > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${p0[0]} ${p0[1]} A 18 18 0 ${large} 0 ${p1[0]} ${p1[1]} L 0 0 Z`}
      fill={runeColors[rune]}
    />
  );
};
type GolemProps = {
  runes: [Rune, number][];
  health: [number, number];
  armor: [number, number];
  shield: [number, number];
};

export const Golem = (props: GolemProps): React.ReactElement => {
  const { runes } = props;
  const total = runes.reduce((acc, c) => acc + c[1], 0);

  let cummulative = 0;
  const runeArcs: React.ReactElement[] = [];
  for (let i = 0; i < runes.length; i++) {
    runeArcs.push(
      <Arc
        key={i}
        rune={runes[i][0]}
        start={cummulative / total}
        end={(cummulative + runes[i][1]) / total}
      />
    );
    cummulative += runes[i][1];
  }

  return (
    <svg width="256" height="256" viewBox="-32 -32 64 64">
      <Health {...props} />
      {runeArcs}
    </svg>
  );
};
