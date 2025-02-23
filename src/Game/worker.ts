import { MessageType } from "../types/message";
import "./channel";
import { channel, isInView } from "./channel";
import { actions, entities } from "./values";

setInterval(() => {
  for (const action of actions) {
    const entity = entities.find((e) => e.id === action.entityID);
    if (!entity) continue;
    action.path.shift();
    const nextNode = action.path[0];
    entity.x = nextNode[0];
    entity.y = nextNode[1];

    if (isInView(entity.x, entity.y)) {
      channel.postMessage({
        type: MessageType.UPDATE_ENTITY,
        data: entity,
      });
    }
    if (isInView(action.path[0][0], action.path[0][1])) {
      channel.postMessage({
        type: MessageType.UPDATE_ACTION,
        data: action,
      });
    }
  }
}, 1000);
