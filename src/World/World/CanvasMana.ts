import { GolemEntity } from "../../types/entity";

const manaColor = "#58c8f2";
const emptyColor = "#00000022";
const manaColors = [manaColor, emptyColor];

const outerDiameter = 14;
const innerDiameter = 18;

const spacing = Math.PI / 64;
const innerSpacing = spacing * (outerDiameter / innerDiameter);
const chunkSize = 5;

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

export const renderMana = (
  ctx: CanvasRenderingContext2D,
  golem: GolemEntity
): void => {
  const { mana } = golem;
  const c: Vec = [golem.pos[0] + 0.5, golem.pos[1] + 0.5];
  if (mana[1] === 0) return;

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

      const innerEndRad = innerStartRad + pts[j] * innerRadPerPoint;

      ctx.fillStyle = manaColors[j];
      ctx.beginPath();
      ctx.arc(c[0], c[1], outerDiameter, startRad, endRad, false);
      ctx.arc(c[0], c[1], innerDiameter, innerEndRad, innerStartRad, true);
      ctx.closePath();
      ctx.fill();

      startRad = endRad;
      innerStartRad = innerEndRad;
    }
  }
};
