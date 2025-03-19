import { EntityType, HealthEntity } from "../../types/entity";
const healthColor = "#fbf9f5";
const armorColor = "#ff9e4a";
const shieldColor = "#65c4fb";
const emptyColor = "#00000022";
const healthColors = [healthColor, armorColor, shieldColor, emptyColor];

const outerDiameter = 31;
const innerDiameter = 20;

const renderEmptyHealth = (ctx: CanvasRenderingContext2D, c: Vec): void => {
  ctx.beginPath();
  ctx.arc(c[0], c[1], outerDiameter, 0, Math.PI * 2, false);
  ctx.arc(c[0], c[1], innerDiameter, Math.PI * 2, 0, true);
  ctx.closePath();
  ctx.fillStyle = emptyColor;
  ctx.fill();
};

// spacing between chunks
const spacing = Math.PI / 64;
const innerSpacing = spacing * (outerDiameter / innerDiameter);
const chunkSize = 5;

// return [health, armor, shield, empty] for up to chunkSize points
const getNextPoints = <T extends EntityType, V extends object>(
  e: HealthEntity<T, V>,
  pointsUsed: number,
  chunkSize: number
): [number, number, number, number] => {
  let pointsLeft = chunkSize;
  const health = Math.min(pointsLeft, Math.max(0, e.health[0] - pointsUsed));
  pointsLeft = Math.max(pointsLeft - health);

  const armor = Math.min(
    pointsLeft,
    Math.min(Math.max(0, e.health[0] + e.armor[0] - pointsUsed), e.armor[0])
  );
  pointsLeft = Math.max(pointsLeft - armor);

  const shield = Math.min(
    pointsLeft,
    Math.min(
      Math.max(0, e.health[0] + e.armor[0] + e.shield[0] - pointsUsed),
      e.shield[0]
    )
  );
  pointsLeft = Math.max(pointsLeft - shield);
  return [health, armor, shield, pointsLeft];
};

export const renderHealth = <T extends EntityType, V extends object>(
  ctx: CanvasRenderingContext2D,
  e: HealthEntity<T, V>
): void => {
  const { health, armor, shield } = e;

  const totalHealth = health[1] + armor[1] + shield[1];
  const c: Vec = [e.pos[0] * 64 + 32, e.pos[1] * 64 + 32];
  if (totalHealth === 0) {
    renderEmptyHealth(ctx, c);
    return;
  }

  const numChunks = Math.ceil(totalHealth / chunkSize);
  const outerRadPerPoint = (Math.PI * 2 - spacing * numChunks) / totalHealth;
  const innerRadPerPoint =
    (Math.PI * 2 - innerSpacing * numChunks) / totalHealth;

  let pointsUsed = 0;
  for (let i = 0; i < numChunks; i++) {
    const thisChunkSize =
      i < numChunks - 1
        ? chunkSize
        : totalHealth % chunkSize === 0
        ? chunkSize
        : totalHealth % chunkSize;
    const pts = getNextPoints(e, pointsUsed, thisChunkSize);
    pointsUsed += pts.reduce((acc, c) => acc + c, 0);

    let startRad = i * (spacing + chunkSize * outerRadPerPoint);
    let innerStartRad = i * (innerSpacing + chunkSize * innerRadPerPoint);
    for (let j = 0; j < pts.length; j++) {
      if (pts[j] === 0) continue;
      const endRad = startRad + pts[j] * outerRadPerPoint;

      const innerEndRad = innerStartRad + pts[j] * innerRadPerPoint;

      ctx.fillStyle = healthColors[j];
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
