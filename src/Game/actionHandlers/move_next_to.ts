import {
  ActionProgress,
  ActionType,
  MOVE_NEXT_TO,
  MOVE_NEXT_TOProgress,
} from "../../types/actions";
import { Entity, GolemEntity } from "../../types/entity";
import { dist, eq } from "../../types/vec";
import { game } from "../game";
import { aStarPath } from "../path";
import { isArgs, isVec } from "../validation";

const maker = (a: MOVE_NEXT_TO): ActionProgress | true | null => {
  if (!isArgs([a.v], isVec)) return null;
  const golem = game.entityM.get(a.id) as GolemEntity;
  // If we're already there, do nothing.
  if (dist(golem.pos, a.v) <= 1) return null;

  // Calculate new path
  const old = game.actionM.get(a.id) as ActionProgress | undefined;
  const wasMoving = old && old.__type === ActionType.MOVE_NEXT_TO;

  const path = ((): Vec[] | null => {
    if (wasMoving) {
      return old.path;
    }
    const path = aStarPath(golem.pos, a.v);
    if (path == null) return null;
    path.pop();
    return path;
  })();
  if (!path) return null;
  const action: MOVE_NEXT_TOProgress = {
    __type: ActionType.MOVE_NEXT_TO,
    goal: [...a.v],
    path: path,
    pos: path[0],
    // carry over progress
    progress: wasMoving ? [old.progress[0], golem.weight] : [0, golem.weight],
  };
  if (
    wasMoving &&
    old.path.every((v, i) => path[i].length === v.length && eq(path[i], v))
  ) {
    return true;
  }
  // Create new ActionProgress
  return action;
};

const processor = (
  rate: number,
  e: Entity,
  mp: MOVE_NEXT_TOProgress
): boolean => {
  const golem = e as GolemEntity;
  mp.progress[0] += golem.speed * rate * game.powers.attune_power;
  while (mp.progress[0] >= mp.progress[1]) {
    if (game.entityAt(mp.path[1])) {
      const newPath = aStarPath(golem.pos, mp.goal);
      if (!newPath) return true;
      newPath.pop();
      mp.path = newPath;
    }
    mp.progress[0] -= mp.progress[1];
    mp.path.shift();
    const nextNode = mp.path[0];
    game.updateFoW(golem.pos, nextNode, golem.visionRange);
    golem.pos = [...nextNode];
    mp.pos = [...nextNode];
  }
  return mp.path.length === 1;
};

export const move_next_toHandler = [maker, processor] as const;
