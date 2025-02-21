const healthColor = "#fd4c63";
const armorColor = "#fde86f";
const shieldColor = "#65c4fb";

// spacing between chunks
const spacing = Math.PI / 50;
const innerSpacing = spacing * (31 / 20);
const chunkHealthValue = 5;

const getColor = (props: HealthProps, i: number): string => {
  const c = i * chunkHealthValue;
  if (c < props.health) return healthColor;
  if (c < props.health + props.armor) return armorColor;
  return shieldColor;
};

const getOpacity = (props: HealthProps, i: number): [number, boolean] => {
  const currentHealth = Math.floor(props.percent * props.totalHealth);
  const min = i * chunkHealthValue;
  const max = Math.min((i + 1) * chunkHealthValue, props.totalHealth);
  console.log(min, max, currentHealth);
  if (currentHealth >= max) return [1, false];
  if (currentHealth < min) return [0.2, false];
  return [((currentHealth - min) / (max - currentHealth)) * 0.8 + 0.2, true];
};

type HealthProps = {
  health: number;
  armor: number;
  shield: number;
  totalHealth: number;
  percent: number;
};
export const Health = (props: HealthProps): React.ReactElement => {
  const { totalHealth } = props;
  const chunks = Math.ceil(totalHealth / chunkHealthValue);
  const paths: JSX.Element[] = [];
  const radPerHealth = (Math.PI * 2 - spacing * chunks) / totalHealth;
  const innerRadPerHealth = (Math.PI * 2 - innerSpacing * chunks) / totalHealth;
  for (let i = 0; i < chunks; i++) {
    const thisChunkValue =
      i < chunks - 1 ? chunkHealthValue : totalHealth % (i * chunkHealthValue);

    const startRad = i * (spacing + chunkHealthValue * radPerHealth);
    const endRad = startRad + thisChunkValue * radPerHealth;
    const p0 = [Math.sin(startRad), Math.cos(startRad)];
    const p1 = [Math.sin(endRad), Math.cos(endRad)];

    const innerStartRad =
      i * (innerSpacing + chunkHealthValue * innerRadPerHealth);
    const innerEndRad = innerStartRad + thisChunkValue * innerRadPerHealth;
    const p3 = [Math.sin(innerStartRad), Math.cos(innerStartRad)];
    const p4 = [Math.sin(innerEndRad), Math.cos(innerEndRad)];
    const large = endRad - startRad > Math.PI ? 1 : 0;

    const [op, selected] = getOpacity(props, i);

    paths.push(
      <path
        key={i}
        opacity={op}
        strokeWidth={selected ? 1 : 0}
        stroke={selected ? "#fff" : ""}
        fill={getColor(props, i)}
        d={`M${p0[0] * 31} ${p0[1] * 31} A31 31 0 ${large} 0 ${p1[0] * 31} ${
          p1[1] * 31
        }L${p4[0] * 20} ${p4[1] * 20}A20 20 0 ${large} 1 ${p3[0] * 20} ${
          p3[1] * 20
        }Z`}
      />
    );
  }
  return <>{paths}</>;
};

/*
  const p0 = [Math.sin(start) * 18, Math.cos(start) * 18];
  const p1 = [Math.sin(end) * 18, Math.cos(end) * 18];
  const large = end - start > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${p0[0]} ${p0[1]} A 18 18 0 ${large} 0 ${p1[0]} ${p1[1]} L 0 0 Z`}
      fill={runeColors[rune]}
    />
  );

*/
