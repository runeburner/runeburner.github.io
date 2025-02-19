import { Rune, Runes } from "../../Game/runes";

interface ArcProps {
  start: number;
  end: number;
  rune: Rune;
}

const runeColors = {
  [Runes.VOID]: "red",
  [Runes.LABOR]: "blue",
  [Runes.WIND]: "green",
};
const Arc = ({ start, end, rune }: ArcProps): React.ReactElement => {
  start *= Math.PI * 2;
  end *= Math.PI * 2;

  const p0 = [Math.sin(start) * 20, Math.cos(start) * 20];
  const p1 = [Math.sin(end) * 20, Math.cos(end) * 20];
  const large = end - start > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${p0[0]} ${p0[1]} A 20 20 0 ${large} 0 ${p1[0]} ${p1[1]} L 0 0 Z`}
      fill={runeColors[rune]}
    />
  );
};

interface GolemProps {
  runes: [Rune, number][];
}

export const Golem = ({ runes }: GolemProps): React.ReactElement => {
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
      <circle r="32" fill="#444" />
      <circle r="20" fill="#888" />
      {runeArcs}
    </svg>
  );
};
