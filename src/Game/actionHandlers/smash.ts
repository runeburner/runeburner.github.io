import {
  ActionProgress,
  ActionType,
  SMASH,
  SMASHProgress,
} from "../../types/actions";
import { Entity, EntityType } from "../../types/entity";
import { dist } from "../../types/vec";
import { game } from "../game";
import { isArgs, isNumber } from "../validation";

const maker = (a: SMASH): ActionProgress | true | null => {
  if (!isArgs([a.target], isNumber)) return null;
  const old = game.actions.get(a.id);
  if (old && old.__type === ActionType.SMASH) return true;
  const golem = game.entities.get(a.id);
  if (golem?.__type !== EntityType.GOLEM) return true;
  const target = game.entities.get(a.target);
  if (!target) return null;

  if (dist(golem.pos, target.pos) > 1) return null;

  return {
    __type: ActionType.SMASH,
    pos: [...golem.pos],
    target: a.target,
    progress: [0, 2],
  };
};
const processor = (
  rate: number,
  _e: Entity,
  action: SMASHProgress
): boolean => {
  const target = game.entities.get(action.target);
  if (!target) return true;
  action.progress[0] += rate * game.powers.musicalStrength;

  while (action.progress[0] >= action.progress[1]) {
    action.progress[0] -= action.progress[1];
    const died = game.damage(target, 1);
    if (died) return true;
  }

  return false;
};

export const smashHandler = [maker, processor] as const;
