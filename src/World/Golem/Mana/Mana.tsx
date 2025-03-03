import { Vec } from "../../../types/vec";

const healthColor = "#58c8f2";
const emptyColor = "#00000022";
const healthColors = [healthColor, emptyColor];

const outerDiameter = 14;
const innerDiameter = 18;

const emptyHealth = (
  <path
    fill={emptyColor}
    d={`M0 32 A32 32 0 1 1 0.001 32L0.001 20 A20 20 0 1 0 0 20`}
  />
);

// spacing between chunks
const spacing = Math.PI / 64;
const innerSpacing = spacing * (outerDiameter / innerDiameter);
const chunkSize = 5;

// return [health, armor, shield, empty] for up to chunkSize points
const getNextPoints = (
  mana: Vec,
  pointsUsed: number,
  chunkSize: number
): [number, number] => {
  let pointsLeft = chunkSize;
  const health = Math.min(pointsLeft, Math.max(0, mana[0] - pointsUsed));
  pointsLeft = Math.max(pointsLeft - health);

  return [health, pointsLeft];
};

type HealthProps = {
  mana: Vec;
};

export const Mana = ({ mana }: HealthProps): React.ReactElement => {
  if (mana[1] === 0) return <>{emptyHealth}</>;
  const paths: JSX.Element[] = [];

  const numChunks = Math.ceil(mana[1] / chunkSize);
  const outerRadPerPoint = (Math.PI * 2 - spacing * numChunks) / mana[1];
  const innerRadPerPoint = (Math.PI * 2 - innerSpacing * numChunks) / mana[1];

  let pointsUsed = 0;
  for (let i = 0; i < numChunks; i++) {
    const thisChunkSize =
      i < numChunks - 1
        ? chunkSize
        : mana[1] % chunkSize === 0
        ? chunkSize
        : mana[1] % chunkSize;
    const pts = getNextPoints(mana, pointsUsed, thisChunkSize);
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
  }
  return <>{paths}</>;
};
