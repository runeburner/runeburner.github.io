import { game } from "../../Game/game";
import { EntityType, GolemEntity } from "../../types/entity";
import { Rune } from "../../types/rune";
import { Vec } from "../../types/vec";
import { camera } from "./Camera";

const size = 60;
const runeColors = {
  [Rune.VOID]: "#ff000088",
  [Rune.LABOR]: "#0000ff88",
  [Rune.WIND]: "#00ff0088",
};
const renderRuneArcs = (
  ctx: CanvasRenderingContext2D,
  golem: GolemEntity,
  pos: Vec
) => {
  const { runes } = golem;
  const total = runes.reduce((acc, c) => acc + c[1], 0);

  let cummulative = 0;
  for (let i = 0; i < runes.length; i++) {
    const c = [pos[0] * 64 + 32, pos[1] * 64 + 32];
    const start = (cummulative / total) * Math.PI * 2;
    const end = ((cummulative + runes[i][1]) / total) * Math.PI * 2;

    const p0 = [Math.sin(start) * size, Math.cos(start) * size];
    const p1 = [Math.sin(end) * size, Math.cos(end) * size];
    const color = runeColors[runes[i][0] as Rune];
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(c[0], c[1]);

    ctx.lineTo(c[0] + p0[0], c[1] + p0[1]);
    ctx.lineTo(c[0] + p1[0], c[1] + p1[1]);
    // ctx.arc(c[0], c[1], size, 0, end - start, true);
    // ctx.moveTo(c[0], c[1]);
    ctx.closePath();
    ctx.fill();

    cummulative += runes[i][1];
  }
};

export const renderEntities = (ctx: CanvasRenderingContext2D) => {
  for (const e of Object.values(game.entityM)) {
    if (!camera.isInView(e.pos)) continue;
    switch (e.__type) {
      case EntityType.GOLEM: {
        renderRuneArcs(ctx, e, e.pos);
        break;
      }
    }
  }
};
