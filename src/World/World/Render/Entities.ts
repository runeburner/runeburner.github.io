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
  for (const e of game.entityM.values()) {
    if (!camera.isInView(e.pos)) continue;
    switch (e.__type) {
      case EntityType.GOLEM: {
        renderHealth(ctx, e);
        renderRuneArcs(ctx, e);
        renderMana(ctx, e);

        const action = game.actionM.get(e.id);
        if (action) {
          renderAction(ctx, action);
        }
        break;
      }
      case EntityType.HEART: {
        renderHealth(ctx, e);
        const heart = new Path2D(
          "M0.8683333333 0.1920833333a0.2291666667 0.2291666667 0 0 0-0.3241666667 0L0.5 0.23625l-0.04416666667-0.04416666667a0.2291666667 0.2291666667 0 0 0-0.3241666667 0.3241666667l0.04416666667 0.04416666667L0.5 0.8845833333l0.3241666667-0.3241666667 0.04416666667-0.04416666667a0.2291666667 0.2291666667 0 0 0 0-0.3241666667z"
        );
        const transform = ctx.getTransform();
        const subtr = ctx.getTransform();
        const heartScale = 0.5;
        subtr.e =
          (e.pos[0] - camera.c.pos[0] + heartScale / 2) * camera.c.scale;
        subtr.f =
          (e.pos[1] - camera.c.pos[1] + heartScale / 2) * camera.c.scale;
        subtr.a = camera.c.scale * heartScale;
        subtr.d = camera.c.scale * heartScale;
        ctx.setTransform(subtr);
        ctx.fillStyle = "red";
        ctx.fill(heart);
        ctx.setTransform(transform);
        break;
      }
      case EntityType.DUMMY: {
        renderHealth(ctx, e);
        break;
      }
    }
  }
};
