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
  const { pos, runes: runesRec } = golem;
  const runes = Object.entries(runesRec) as [Rune, number][];
  const total = runes.reduce((acc, c) => acc + c[1], 0);

  let cummulative = 0;
  for (let i = 0; i < runes.length; i++) {
    const c = [pos[0] + 0.5, pos[1] + 0.5];
    const start = (cummulative / total) * Math.PI * 2;
    const end = ((cummulative + runes[i][1]) / total) * Math.PI * 2;

    const color = runeColors[runes[i][0]];
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(c[0], c[1]);
    ctx.arc(c[0], c[1], size, start, end, false);
    ctx.closePath();
    ctx.fill();

    cummulative += runes[i][1];
  }
};

const fillPath = (
  ctx: CanvasRenderingContext2D,
  p: Path2D,
  color: string,
  scale: number,
  pos: Vec
): void => {
  const transform = ctx.getTransform();
  const subtr = ctx.getTransform();
  subtr.e = (pos[0] - camera.c.pos[0] + scale / 2) * camera.c.scale;
  subtr.f = (pos[1] - camera.c.pos[1] + scale / 2) * camera.c.scale;
  subtr.a = camera.c.scale * scale;
  subtr.d = camera.c.scale * scale;
  ctx.setTransform(subtr);
  ctx.fillStyle = color;
  ctx.fill(p);
  ctx.setTransform(transform);
};

const rockPath = new Path2D("m8 3 4 8 5-5 5 15H2L8 3z");

const heartPath = new Path2D(
  "M2 9h20 M0.8683333333 0.1920833333a0.2291666667 0.2291666667 0 0 0-0.3241666667 0L0.5 0.23625l-0.04416666667-0.04416666667a0.2291666667 0.2291666667 0 0 0-0.3241666667 0.3241666667l0.04416666667 0.04416666667L0.5 0.8845833333l0.3241666667-0.3241666667 0.04416666667-0.04416666667a0.2291666667 0.2291666667 0 0 0 0-0.3241666667z"
);

const runeCrystalPath = new Path2D(
  "M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z"
);

export const renderEntities = (ctx: CanvasRenderingContext2D): void => {
  for (const e of game.entities.values()) {
    if (!camera.isInView(e.pos) || !game.canSeeTile(e.pos)) continue;
    switch (e.__type) {
      case EntityType.GOLEM: {
        renderHealth(ctx, e);
        renderRuneArcs(ctx, e);
        renderMana(ctx, e);

        const action = game.actions.get(e.id);
        if (action) {
          renderAction(ctx, action);
        }
        break;
      }
      case EntityType.HEART: {
        renderHealth(ctx, e);
        fillPath(ctx, heartPath, "rgb(255, 26, 26)", 0.5, e.pos);
        break;
      }
      case EntityType.DUMMY: {
        renderHealth(ctx, e);
        break;
      }
      case EntityType.ROCK: {
        fillPath(ctx, rockPath, "#4a698c", 0.04, e.pos);
        break;
      }
      case EntityType.RUNE_CRYSTAL: {
        fillPath(ctx, runeCrystalPath, "#938725", 0.04, e.pos);
        break;
      }
    }
  }
};
