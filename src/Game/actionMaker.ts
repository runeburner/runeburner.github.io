import {
  ActionProgress,
  ActionType,
  ActionTypeMap,
  ATTUNE,
  DIE,
  MINE,
  MOVE_NEXT_TO,
  MOVE_NEXT_TOProgress,
  SMASH,
} from "../types/actions";
import { Entity, EntityType, GolemEntity } from "../types/entity";
import { Offset } from "../types/map";
import { Tile } from "../types/tile";
import { dist, eq } from "../types/vec";
import { game } from "./game";
import { aStarPath } from "./path";
import { isArgs, isNumber, isVec } from "./validation";

export const maker: {
  [T in ActionType]: (a: ActionTypeMap[T][0]) => ActionProgress | true | null;
} = {
  [ActionType.IDLE]: () => null,
  [ActionType.MOVE_NEXT_TO]: (a: MOVE_NEXT_TO) => {
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
  },
  [ActionType.MINE]: (a: MINE) => {
    if (!isArgs([a.v], isVec)) return null;
    const old = game.actionM.get(a.id) as ActionProgress | undefined;
    const golem = game.entityM.get(a.id) as GolemEntity;

    // If it's too far.
    if (dist(golem.pos, a.v) > 1) return null;

    // If the golem is full.
    if (golem.minecapacity[0] === golem.minecapacity[1]) return null;

    // If we're trying to mine anything other than a mana crystal
    const tile = game.tileAt(a.v);
    if (tile[Offset.TILE_ID] !== Tile.MANA_CRYSTAL) return null;

    // If we were already mining this tile.
    const wasMining = old && old.__type === ActionType.MINE;
    if (wasMining && eq(old.tile, a.v)) return true;
    return {
      __type: ActionType.MINE,
      pos: [...golem.pos],
      // If we swap mining tile in the middle, carry over progress

      progress: wasMining ? old.progress : [0, tile[Offset.DATA_1]],
      tile: [...a.v],
    };
  },
  [ActionType.ATTUNE]: (a: ATTUNE) => {
    const old = game.actionM.get(a.id) as ActionProgress | undefined;
    const golem = game.entityM.get(a.id) as GolemEntity;
    const heart = ((): Entity | undefined => {
      for (const e of game.entityM.values()) {
        if (e.__type === EntityType.HEART) return e;
      }
      return undefined;
    })();
    if (!heart) return null;

    // If it's too far.
    if (dist(golem.pos, heart.pos) > 1) return null;

    // If we have no mana crystals
    if (golem.minecapacity[0] === 0) return null;

    // If we were already attuning
    if (old && old.__type === ActionType.ATTUNE) return true;

    return {
      __type: ActionType.ATTUNE,
      progress: [0, 2],
      pos: [...golem.pos],
      heart: [...heart.pos],
    };
  },
  [ActionType.DIE]: (a: DIE) => {
    game.removeEntity(a.id);
    return null;
  },
  [ActionType.SMASH]: (a: SMASH) => {
    if (!isArgs([a.target], isNumber)) return null;
    const old = game.actionM.get(a.id) as ActionProgress | undefined;
    if (old && old.__type === ActionType.SMASH) return true;
    const golem = game.entityM.get(a.id) as GolemEntity;
    const target = game.entityM.get(a.target);
    if (!target) return null;

    if (dist(golem.pos, target.pos) > 1) return null;

    return {
      __type: ActionType.SMASH,
      pos: [...golem.pos],
      target: a.target,
      progress: [0, 2],
    };
  },
} as const;
