const healthColor = "#fd4c63";
const armorColor = "#fde86f";
const shieldColor = "#65c4fb";

const outerDiameter = 31;
const innerDiameter = 20;

// spacing between chunks
const spacing = Math.PI / 50;
const innerSpacing = spacing * (outerDiameter / innerDiameter);
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
        d={`M${p0[0] * outerDiameter} ${
          p0[1] * outerDiameter
        } A${outerDiameter} ${outerDiameter} 0 ${large} 0 ${
          p1[0] * outerDiameter
        } ${p1[1] * outerDiameter}L${p4[0] * innerDiameter} ${
          p4[1] * innerDiameter
        }A${innerDiameter} ${innerDiameter} 0 ${large} 1 ${
          p3[0] * innerDiameter
        } ${p3[1] * innerDiameter}Z`}
      />
    );
  }
  return <>{paths}</>;
};
