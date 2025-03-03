import { Rune } from "../../types/rune";
import { Vec } from "../../types/vec";
import { Health } from "./Health/Health";
import { Mana } from "./Mana/Mana";

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

const size = 12;
const Arc = ({ start, end, rune }: ArcProps): React.ReactElement => {
  start *= Math.PI * 2;
  end *= Math.PI * 2;

  const p0 = [Math.sin(start) * size, Math.cos(start) * size];
  const p1 = [Math.sin(end) * size, Math.cos(end) * size];
  const large = end - start > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${p0[0]} ${p0[1]} A ${size} ${size} 0 ${large} 0 ${p1[0]} ${p1[1]} L 0 0 Z`}
      fill={runeColors[rune]}
    />
  );
};
type GolemProps = {
  runes: [Rune, number][];
  health: Vec;
  armor: Vec;
  shield: Vec;
  mana: Vec;
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
    <svg width="100%" height="100%" viewBox="-32 -32 64 64">
      <Health {...props} />
      <Mana mana={props.mana} />
      {runeArcs}
    </svg>
  );
};
