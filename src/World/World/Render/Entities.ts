import { game } from "../../../Game/game";
import { EntityType, GolemEntity } from "../../../types/entity";
import { Rune } from "../../../types/rune";
import { camera } from "../Camera";
import { renderAction } from "./Action";
import { renderHealth } from "./Health";
import { renderMana } from "./Mana";

const size = 12 / 64;
const runeColors = {
  [Rune.VOID]: "#ff000088",
  [Rune.LABOR]: "#0000ff88",
  [Rune.WIND]: "#00ff0088",
};
const renderRuneArcs = (
  ctx: CanvasRenderingContext2D,
  golem: GolemEntity
): void => {
  const { pos, runes } = golem;
  const total = runes.reduce((acc, c) => acc + c[1], 0);

  let cummulative = 0;
  for (let i = 0; i < runes.length; i++) {
    const c = [pos[0] + 0.5, pos[1] + 0.5];
    const start = (cummulative / total) * Math.PI * 2;
    const end = ((cummulative + runes[i][1]) / total) * Math.PI * 2;

    const color = runeColors[runes[i][0] as Rune];
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(c[0], c[1]);
    ctx.arc(c[0], c[1], size, start, end, false);
    ctx.closePath();
    ctx.fill();

    cummulative += runes[i][1];
  }
};

export const renderEntities = (ctx: CanvasRenderingContext2D): void => {
  for (const e of Object.values(game.entityM)) {
    if (!camera.isInView(e.pos)) continue;
    switch (e.__type) {
      case EntityType.GOLEM: {
        renderHealth(ctx, e);
        renderRuneArcs(ctx, e);
        renderMana(ctx, e);

        if (game.actionM[e.id]) {
          renderAction(ctx, game.actionM[e.id]);
        }
        break;
      }
      case EntityType.HEART: {
        renderHealth(ctx, e);
        break;
      }
    }
  }
};
