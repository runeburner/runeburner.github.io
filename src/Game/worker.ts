import { ActionType, MoveAction } from "../types/actions";
import { Entity } from "../types/entity";
import { MessageType } from "../types/message";
import "./channel";
import { channel, isInView } from "./channel";
import { actions, entities } from "./values";

const updateMoveAction = (entity: Entity, action: MoveAction): boolean => {
  action.path.shift();
  if (action.path.length === 0) return true;
  const nextNode = action.path[0];
  entity.x = nextNode[0];
  entity.y = nextNode[1];
  action.x = nextNode[0];
  action.y = nextNode[1];
  return false;
};

setInterval(() => {
  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    const entity = entities.find((e) => e.id === action.entityID);
    if (!entity) continue;
    let done = false;
    switch (action.type) {
      case ActionType.GOLEM_MOVE: {
        done = updateMoveAction(entity, action);
        break;
      }
    }

    if (done) {
      actions.splice(i, 1);
      i--;
    }
    if (isInView(entity.x, entity.y)) {
      channel.postMessage({
        type: MessageType.UPDATE_ENTITY,
        data: entity,
      });
    }
    if (isInView(action.x, action.y)) {
      if (!done) {
        channel.postMessage({
          type: MessageType.UPDATE_ACTION,
          data: action,
        });
      } else {
        console.log("SENDING REMOVE");
        channel.postMessage({
          type: MessageType.REMOVE_ACTION,
          data: action.id,
        });
      }
    }
  }
}, 1000);
