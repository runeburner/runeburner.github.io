import { maker } from "./actionMaker";
import { process } from "./actionProcessor";
import { game } from "./game";

const fps = 30;

const gameTick = (): void => {
  for (let i = 0; i < game.workers.length; i++) {
    const action = game.workers[i].tick(game.workers[i].proxy);
    game.workers[i].lastAction = action;
  }

  for (let i = 0; i < game.workers.length; i++) {
    const a = game.workers[i].lastAction;
    if (!a) continue;
    const f = maker[a.__type];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = f(a as any);
    if (p === null) {
      game.actionM.delete(a.id);
    } else if (p !== true) {
      game.actionM.set(a.id, p);
    }
  }

  const rate = 1 / fps;
  for (const e of game.entityM.values()) {
    const p = game.actionM.get(e.id);
    if (p) {
      const del = process[p.__type](rate, e, p);
      if (del) {
        game.actionM.delete(e.id);
      }
    }
  }
};

setInterval(gameTick, 1000 / fps);
