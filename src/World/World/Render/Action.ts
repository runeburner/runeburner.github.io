import { game } from "../../../Game/game";
import {
  ActionProgress,
  ActionType,
  ATTUNEProgress,
  MINEProgress,
  MOVE_NEXT_TOProgress,
  SMASHProgress,
} from "../../../types/actions";
import { renderProgress } from "./Progress";

const renderMoveNextTo = (
  ctx: CanvasRenderingContext2D,
  action: MOVE_NEXT_TOProgress
): void => {
  const p = action.path;
  let x = 1e99;
  let X = -1;
  let y = 1e99;
  let Y = -1;
  for (const point of p) {
    if (point[0] < x) x = point[0];
    if (point[1] < y) y = point[1];
    if (X < point[0]) X = point[0];
    if (Y < point[1]) Y = point[1];
  }

  ctx.lineWidth = 4 / 64;
  ctx.strokeStyle = "#00ff0044";

  ctx.beginPath();
  ctx.moveTo(p[0][0] + 0.5, p[0][1] + 0.5);
  for (let i = 1; i < p.length; i++) {
    ctx.lineTo(p[i][0] + 0.5, p[i][1] + 0.5);
  }
  ctx.stroke();
  renderProgress(ctx, p[0], action.progress, "#00ff0044");
};

const renderMine = (
  ctx: CanvasRenderingContext2D,
  action: MINEProgress
): void => {
  ctx.lineWidth = 4 / 64;
  ctx.strokeStyle = "#0000ff44";
  ctx.beginPath();
  ctx.moveTo(action.pos[0] + 0.5, action.pos[1] + 0.5);
  ctx.lineTo(action.tile[0] + 0.5, action.tile[1] + 0.5);
  ctx.stroke();
  renderProgress(ctx, action.pos, action.progress, "#0000ff44");
};

const renderAttune = (
  ctx: CanvasRenderingContext2D,
  action: ATTUNEProgress
): void => {
  ctx.lineWidth = 4 / 64;
  ctx.strokeStyle = "#0000ff44";
  ctx.beginPath();
  ctx.moveTo(action.pos[0] + 0.5, action.pos[1] + 0.5);
  ctx.lineTo(action.heart[0] + 0.5, action.heart[1] + 0.5);
  ctx.stroke();
  renderProgress(ctx, action.pos, action.progress, "#0000ff44");
};

const renderSmash = (
  ctx: CanvasRenderingContext2D,
  action: SMASHProgress
): void => {
  try {
    ctx.lineWidth = 4 / 64;
    ctx.strokeStyle = "#88ffff44";
    ctx.beginPath();
    ctx.moveTo(action.pos[0] + 0.5, action.pos[1] + 0.5);
    ctx.lineTo(
      game.entityM.get(action.target)!.pos[0] + 0.5,
      game.entityM.get(action.target)!.pos[1] + 0.5
    );
    ctx.stroke();
    renderProgress(ctx, action.pos, action.progress, "#88ffff44");
  } catch (err) {
    console.error(err);
  }
};

export const renderAction = (
  ctx: CanvasRenderingContext2D,
  p: ActionProgress
): void => {
  switch (p.__type) {
    case ActionType.MOVE_NEXT_TO:
      renderMoveNextTo(ctx, p);
      break;
    case ActionType.MINE:
      renderMine(ctx, p);
      break;
    case ActionType.ATTUNE:
      renderAttune(ctx, p);
      break;
    case ActionType.SMASH:
      renderSmash(ctx, p);
      break;
  }
};
