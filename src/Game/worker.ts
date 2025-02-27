import { ActionType } from "../types/actions";
import { UIMessageType } from "../types/uiMessages";
import { updateMineAction, updateMoveAction } from "./actions";
import { camera } from "./camera";
import "./channel";
import { channel } from "./channel";
import { game } from "./game";
import { waitingActionMap } from "./values";

setInterval(() => {
  for (let i = 0; i < game.actions.length; i++) {
    const action = game.actions[i];
    const entity = game.entities.find((e) => e.id === action.entityID);
    if (!entity) continue;
    let done = false;
    switch (action.type) {
      case ActionType.GOLEM_MOVE: {
        done = updateMoveAction(entity, action);
        break;
      }
      case ActionType.MINE: {
        done = updateMineAction(entity, action);
        break;
      }
    }

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
}, 1000);
