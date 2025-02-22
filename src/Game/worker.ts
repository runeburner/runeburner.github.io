import { MessageType } from "../types/message";
import { actions } from "../types/actions";
import "./channel";
import { channel } from "./channel";
import { entities } from "./values";

setInterval(() => {
  for (const action of actions) {
    const entity = entities.find((e) => e.id === action.id);
    if (!entity) continue;
    action.path.shift();
    const nextNode = action.path[0];
    entity.x = nextNode[0];
    entity.y = nextNode[1];
    channel.postMessage({
      type: MessageType.UPDATE_ENTITY,
      data: entity,
    });
    channel.postMessage({
      type: MessageType.UPDATE_ACTION,
      data: action,
    });
  }
}, 1000);
