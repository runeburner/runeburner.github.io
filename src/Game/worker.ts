import { ActionType, MineAction, MoveAction } from "../types/actions";
import { Entity, GolemEntity } from "../types/entity";
import { MessageType } from "../types/message";
import "./channel";
import { channel, isInView } from "./channel";
import { actions, entities, waitingActionMap } from "./values";

const updateMoveAction = (entity: Entity, action: MoveAction): boolean => {
  const golem = entity as GolemEntity;
  action.progress[0] += golem.speed;
  while (action.progress[0] >= action.progress[1]) {
    action.progress[0] -= action.progress[1];
    action.path.shift();
    const nextNode = action.path[0];
    entity.x = nextNode[0];
    entity.y = nextNode[1];
    action.x = nextNode[0];
    action.y = nextNode[1];
  }
  return action.path.length === 1;
};

const updateMineAction = (entity: Entity, action: MineAction): boolean => {
  const golem = entity as GolemEntity;
  action.progress[0] += golem.mineSpeed;
  while (
    action.progress[0] >= action.progress[1] &&
    golem.minecapacity[0] < golem.minecapacity[1]
  ) {
    action.progress[0] -= action.progress[1];
    golem.minecapacity[0]++;
  }

  return golem.minecapacity[0] === golem.minecapacity[1];
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
      case ActionType.MINE: {
        done = updateMineAction(entity, action);
        break;
      }
    }

    if (done) {
      actions.splice(i, 1);
      const f = waitingActionMap[action.id];
      if (f) {
        f("OK");
        delete waitingActionMap[action.id];
      }
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
        channel.postMessage({
          type: MessageType.REMOVE_ACTION,
          data: action.id,
        });
      }
    }
  }
}, 1000);
