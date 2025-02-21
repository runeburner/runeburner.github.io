const healthColor = "#fd4c63";
const armorColor = "#fde86f";
const shieldColor = "#65c4fb";
const healthColors = [healthColor, armorColor, shieldColor, "#ffffff22"];

const outerDiameter = 31;
const innerDiameter = 20;

const emptyHealth = (
  <path d={`M0 32 A32 32 0 1 1 0.001 32L0.001 20 A20 20 0 1 0 0 20`} />
);

// spacing between chunks
const spacing = Math.PI / 50;
const innerSpacing = spacing * (outerDiameter / innerDiameter);
const chunkSize = 5;

// return [health, armor, shield, empty] for up to chunkSize points
const getNextPoints = (
  props: HealthProps,
  pointsUsed: number,
  chunkSize: number
): [number, number, number, number] => {
  let pointsLeft = chunkSize;
  const health = Math.min(
    pointsLeft,
    Math.max(0, props.health[0] - pointsUsed)
  );
  pointsLeft = Math.max(pointsLeft - health);

  const armor = Math.min(
    pointsLeft,
    Math.min(
      Math.max(0, props.health[0] + props.armor[0] - pointsUsed),
      props.armor[0]
    )
  );
  pointsLeft = Math.max(pointsLeft - armor);

  const shield = Math.min(
    pointsLeft,
    Math.min(
      Math.max(
        0,
        props.health[0] + props.armor[0] + props.shield[0] - pointsUsed
      ),
      props.shield[0]
    )
  );
  pointsLeft = Math.max(pointsLeft - shield);
  return [health, armor, shield, pointsLeft];
};

type HealthProps = {
  health: [number, number];
  armor: [number, number];
  shield: [number, number];
};
export const Health = (props: HealthProps): React.ReactElement => {
  const { health, armor, shield } = props;
  const totalHealth = health[1] + armor[1] + shield[1];
  if (totalHealth === 0) return <>{emptyHealth}</>;
  const paths: JSX.Element[] = [];

  const numChunks = Math.ceil(totalHealth / chunkSize);
  const outerRadPerPoint = (Math.PI * 2 - spacing * numChunks) / totalHealth;
  const innerRadPerPoint =
    (Math.PI * 2 - innerSpacing * numChunks) / totalHealth;

  let pointsUsed = 0;
  for (let i = 0; i < numChunks; i++) {
    const thisChunkSize =
      i < numChunks - 1 ? chunkSize : totalHealth % (i * chunkSize);
    const pts = getNextPoints(props, pointsUsed, thisChunkSize);
    console.log(pts);
    pointsUsed += pts.reduce((acc, c) => acc + c, 0);

    let startRad = i * (spacing + chunkSize * outerRadPerPoint);
    let innerStartRad = i * (innerSpacing + chunkSize * innerRadPerPoint);
    for (let j = 0; j < pts.length; j++) {
      if (pts[j] === 0) continue;
      const endRad = startRad + pts[j] * outerRadPerPoint;
      const p0 = [Math.sin(startRad), Math.cos(startRad)];
      const p1 = [Math.sin(endRad), Math.cos(endRad)];

      const innerEndRad = innerStartRad + pts[j] * innerRadPerPoint;
      const p2 = [Math.sin(innerStartRad), Math.cos(innerStartRad)];
      const p3 = [Math.sin(innerEndRad), Math.cos(innerEndRad)];
      const large = endRad - startRad > Math.PI ? 1 : 0;

      paths.push(
        <path
          key={`${i}_${j}`}
          fill={healthColors[j]}
          d={`M${p0[0] * outerDiameter} ${
            p0[1] * outerDiameter
          } A${outerDiameter} ${outerDiameter} 0 ${large} 0 ${
            p1[0] * outerDiameter
          } ${p1[1] * outerDiameter}L${p3[0] * innerDiameter} ${
            p3[1] * innerDiameter
          }A${innerDiameter} ${innerDiameter} 0 ${large} 1 ${
            p2[0] * innerDiameter
          } ${p2[1] * innerDiameter}Z`}
        />
      );
      startRad = endRad;
      innerStartRad = innerEndRad;
    }
    // let startRad = chunkStartRad;
    // let endRad = chunkEndRad;
    // const p0 = [Math.sin(startRad), Math.cos(startRad)];
    // const p1 = [Math.sin(endRad), Math.cos(endRad)];

    // const innerStartRad = i * (innerSpacing + chunkSize * innerRadPerPoint);
    // const innerEndRad = innerStartRad + thisChunkSize * innerRadPerPoint;
    // const p2 = [Math.sin(innerStartRad), Math.cos(innerStartRad)];
    // const p3 = [Math.sin(innerEndRad), Math.cos(innerEndRad)];
    // const large = endRad - startRad > Math.PI ? 1 : 0;

    // const [op, selected] = getOpacity(totalHealth, i);

    // paths.push(
    //   <path
    //     key={i}
    //     opacity={op}
    //     strokeWidth={selected ? 1 : 0}
    //     stroke={selected ? "#fff" : ""}
    //     fill={getColor()}
    //     d={`M${p0[0] * outerDiameter} ${
    //       p0[1] * outerDiameter
    //     } A${outerDiameter} ${outerDiameter} 0 ${large} 0 ${
    //       p1[0] * outerDiameter
    //     } ${p1[1] * outerDiameter}L${p3[0] * innerDiameter} ${
    //       p3[1] * innerDiameter
    //     }A${innerDiameter} ${innerDiameter} 0 ${large} 1 ${
    //       p2[0] * innerDiameter
    //     } ${p2[1] * innerDiameter}Z`}
    //   />
    // );
  }
  return <>{paths}</>;
};
