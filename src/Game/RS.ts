import { SING, FADE, MINE, MOVE_NEXT_TO, SMASH } from "../types/actions";
import { Entity, EntityType, GolemEntity } from "../types/entity";
import { Rune } from "../types/rune";
import { Tile } from "../types/tile";
import { dist } from "../types/vec";
import { game } from "./game";
import { aStarPath } from "./path";
import { isArgs, isNumber, isString, isVec } from "./validation";

export const rs = {
  game: {
    findNearest(e: Entity, tile: Tile, radius: number): Vec | null {
      if (!isArgs([tile, radius], isNumber, isNumber)) return null;
      return game.findClosestTile(e.pos, tile, radius);
    },
    findAll(e: Entity, entity: EntityType, radius: number): Entity[] {
      if (!isArgs([entity, radius], isString, isNumber)) return [];
      return structuredClone(game.findAllEntities(e.pos, entity, radius));
    },
    at(_e: Entity, v: Vec): Int32Array {
      if (!isArgs([v], isVec)) return new Int32Array();
      return game.tileAt(v);
    },
    findClosestEntity(e: Entity, entityType: EntityType): Entity | null {
      if (!isArgs([entityType], isString)) return null;
      return structuredClone(game.findClosestEntity(e.pos, entityType));
    },
  },
  me: {
    runeCrystals(e: GolemEntity): number {
      return e.runeCrystals;
    },
    runeCrystalCapacity(e: GolemEntity): number {
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
      __type: "MOVE_NEXT_TO",
      id: e.id,
      v: v,
    }),
    MINE: (e: Entity, target: number): MINE => ({
      __type: "MINE",
      target: target,
      id: e.id,
    }),
    SING: (e: Entity): SING => ({ __type: "SING", id: e.id }),
    FADE: (e: Entity): FADE => ({ __type: "FADE", id: e.id }),
    SMASH: (e: Entity, id: number): SMASH => ({
      __type: "SMASH",
      id: e.id,
      target: id,
    }),
  },
};
