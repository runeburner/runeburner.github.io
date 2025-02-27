import { MineAction, MoveAction } from "../types/actions";
import { Entity, GolemEntity } from "../types/entity";

export const updateMoveAction = (
  entity: Entity,
  action: MoveAction
): boolean => {
  const golem = entity as GolemEntity;
  action.progress[0] += golem.speed;
  while (action.progress[0] >= action.progress[1]) {
    action.progress[0] -= action.progress[1];
    action.path.shift();
    const nextNode = action.path[0];
    entity.pos = [...nextNode];
    action.pos = [...nextNode];
  }
  return action.path.length === 1;
};

export const updateMineAction = (
  entity: Entity,
  action: MineAction
): boolean => {
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
