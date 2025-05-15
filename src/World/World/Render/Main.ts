import { game } from "../../../Game/game";
import { camera } from "../Camera";
import { renderEntities } from "./Entities";
import { renderTiles } from "./Tile";

const clear = (ctx: CanvasRenderingContext2D): void => {
  const transform = ctx.getTransform();
  transform.e = -camera.c.pos[0] * camera.c.scale;
  transform.f = -camera.c.pos[1] * camera.c.scale;
  transform.a = camera.c.scale;
  transform.d = camera.c.scale;
  ctx.setTransform(transform);
  ctx.clearRect(
    camera.c.pos[0],
    camera.c.pos[1],
    ctx.canvas.width,
    ctx.canvas.height
  );
};

export const renderWorld = (ctx: CanvasRenderingContext2D): void => {
  clear(ctx);
  ctx.strokeStyle = "#ffffffff";
  ctx.lineWidth = 1 / 32;
  ctx.strokeRect(
    game.plane.bounds[0] - 3 / 128,
    game.plane.bounds[1] - 3 / 128,
    game.plane.bounds[2] + 6 / 128,
    game.plane.bounds[3] + 6 / 128
  );
  renderTiles(ctx);
  renderEntities(ctx);
};
