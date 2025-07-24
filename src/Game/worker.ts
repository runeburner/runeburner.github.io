import { runGameSelectors } from "../store/gameRedux";
import { ActionHandler, ActionProgress, ActionType } from "../types/actions";
import { Entity } from "../types/entity";
import { singHandler } from "./actionHandlers/sing";
import { dieHandler } from "./actionHandlers/die";
import { idleHandler } from "./actionHandlers/idle";
import { mineHandler } from "./actionHandlers/mine";
import { move_next_toHandler } from "./actionHandlers/move_next_to";
import { smashHandler } from "./actionHandlers/smash";
import { game } from "./game";
import { Realms } from "../Realm/Realms";

type MakerFn<T extends ActionType> = (
  a: ActionHandler[T][0]
) => ActionProgress | true | null;

type ProcessorFn<T extends ActionType> = (
  rate: number,
  e: Entity,
  p: ActionHandler[T][1]
) => boolean;

type Handler = {
  [T in ActionType]: readonly [MakerFn<T>, ProcessorFn<T>];
};

const handler = {
  [ActionType.IDLE]: idleHandler,
  [ActionType.MOVE_NEXT_TO]: move_next_toHandler,
  [ActionType.MINE]: mineHandler,
  [ActionType.SING]: singHandler,
  [ActionType.DIE]: dieHandler,
  [ActionType.SMASH]: smashHandler,
} as const satisfies Handler;

const fps = 30;
const rate = 1 / fps;

const gameTick = (): void => {
  if (game.realmId == "") return;
  // Update last actions
  for (let i = 0; i < game.workers.length; i++) {
    const action = game.workers[i].tick(game.workers[i].proxy);
    game.workers[i].lastAction = action;
  }

  // Setup progresses
  for (let i = 0; i < game.workers.length; i++) {
    const a = game.workers[i].lastAction;
    if (!a) continue;
    const f = handler[a.__type][0] as (
      action: typeof a
    ) => ReturnType<MakerFn<ActionType>>;
    const p = f(a);

    if (p === null) {
      game.actions.delete(a.id);
    } else if (p !== true) {
      game.actions.set(a.id, p);
    }
  }

  // process actions
  for (const e of game.entities.values()) {
    const p = game.actions.get(e.id);
    if (!p) continue;
    const f = handler[p.__type][1] as ProcessorFn<ActionType>;
    const del = f(rate, e, p);
    if (del) game.actions.delete(e.id);
  }

  // Check if the map is completed
  if (!game.realmCompleted) {
    const realm = Realms.get(game.realmId);
    if (realm?.goals.every((g) => g.check(game))) {
      game.realmCompleted = true;
    }
  }

  runGameSelectors();
};

setInterval(gameTick, 1000 / fps);
