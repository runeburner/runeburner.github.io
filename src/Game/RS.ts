import {
  SING,
  FADE,
  MINE,
  MOVE_NEXT_TO,
  SMASH,
  IDLE,
  ActionType,
} from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { Rune } from "../types/rune";
import { dist } from "../types/vec";
import { game } from "./game";
import { aStarPath } from "./path";
import { InternalRSNamespace } from "./proxy";
import { isArgs, isNumber, isString, isVec } from "./validation";

export const rs: InternalRSNamespace<RS> = {
  world: {
    findAll(e: Entity, entity: EntityType, radius: number): Entity[] {
      if (!isArgs([entity, radius], isString, isNumber)) return [];
      return structuredClone(game.findAllEntities(e.pos, entity, radius));
    },
    findClosestEntity(e: Entity, entityType: EntityType): Entity | null {
      if (!isArgs([entityType], isString)) return null;
      return structuredClone(game.findClosestEntity(e.pos, entityType));
    },
  },
  me: {
    runeCrystals(e: Entity): number {
      if (e.__type !== EntityType.GOLEM) return -1;
      return e.runeCrystals;
    },
    runeCrystalCapacity(e: Entity): number {
      if (e.__type !== EntityType.GOLEM) return -1;
      return e.runes[Rune.VOID] * game.powers.capacityPerRune;
    },
    isInRange(e: Entity, v: Vec): boolean {
      if (!isArgs([v], isVec)) return false;
      return dist(e.pos, v) <= 1;
    },
    hasPathTo(e: Entity, v: Vec): boolean {
      return aStarPath(e.pos, v) !== null;
    },
  },
  act: {
    MOVE_NEXT_TO: (e: Entity, v: Vec): MOVE_NEXT_TO => ({
      __type: ActionType.MOVE_NEXT_TO,
      id: e.id,
      v: v,
    }),
    MINE: (e: Entity, target: number): MINE => ({
      __type: ActionType.MINE,
      target: target,
      id: e.id,
    }),
    SING: (e: Entity): SING => ({ __type: ActionType.SING, id: e.id }),
    FADE: (e: Entity): FADE => ({ __type: ActionType.FADE, id: e.id }),
    SMASH: (e: Entity, id: number): SMASH => ({
      __type: ActionType.SMASH,
      id: e.id,
      target: id,
    }),
    IDLE: (e: Entity): IDLE => ({ __type: ActionType.IDLE, id: e.id }),
  },
};
