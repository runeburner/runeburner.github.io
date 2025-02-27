import {
  Action,
  ActionDataMap,
  ActionHandlers,
  ActionType,
} from "../types/actions";
import { Entity } from "../types/entity";
import { UIMessageType } from "../types/uiMessages";
import {
  updateAttuneAction,
  updateMineAction,
  updateMoveAction,
} from "./actions";
import { camera } from "./camera";
import "./channel";
import { channel } from "./channel";
import { game } from "./game";
import { waitingActionMap } from "./values";

const handlers: ActionHandlers = {
  [ActionType.GOLEM_MOVE]: updateMoveAction,
  [ActionType.MINE]: updateMineAction,
  [ActionType.ATTUNE]: updateAttuneAction,
};

const processAction = <T extends ActionType>(
  e: Entity,
  a: Action<T, ActionDataMap[T]>
): boolean => handlers[a.type](e, a);

setInterval(() => {
  for (let i = 0; i < game.actions.length; i++) {
    const action = game.actions[i];
    const entity = game.entities.find((e) => e.id === action.entityID);
    if (!entity) continue;
    const done = processAction(entity, action);
    if (done) {
      game.actions.splice(i, 1);
      const f = waitingActionMap[action.id];
      if (f) {
        f("OK");
        delete waitingActionMap[action.id];
      }
      i--;
    }

    if (camera.isInView(entity.pos)) {
      channel.postMessage({
        type: UIMessageType.UPDATE_ENTITY,
        data: entity,
      });
    }
    if (camera.isInView(action.pos)) {
      if (!done) {
        channel.postMessage({
          type: UIMessageType.UPDATE_ACTION,
          data: action,
        });
      } else {
        channel.postMessage({
          type: UIMessageType.REMOVE_ACTION,
          data: action.id,
        });
      }
    }
  }
}, 100);
