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
  ctx.lineWidth = 1 / 16;
  ctx.strokeRect(
    game.plane.bounds[0],
    game.plane.bounds[1],
    game.plane.bounds[2],
    game.plane.bounds[3]
  );
  renderTiles(ctx);
  renderEntities(ctx);
};
