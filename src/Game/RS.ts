import { ATTUNE, DIE, MINE, MOVE_NEXT_TO, SMASH } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { Tile } from "../types/tile";
import { dist } from "../types/vec";
import { game } from "./game";
import { isArgs, isNumber, isString, isVec } from "./validation";

export const rs = {
  game: {
    findNearest(e: Entity, tile: Tile, radius: number): Vec | null {
      if (!isArgs([tile, radius], isNumber, isNumber)) return null;
      return game.findClosestTile(e.pos, tile, radius);
    },
    findAll(e: Entity, tile: Tile, radius: number): Vec[] {
      if (!isArgs([tile, radius], isNumber, isNumber)) return [];
      return game.findAllTiles(e.pos, tile, radius);
    },
    me(e: Entity): Entity {
      return structuredClone(e);
    },
    at(_e: Entity, v: Vec): Int32Array {
      if (!isArgs([v], isVec)) return new Int32Array();
      return game.tileAt(v);
    },
    isInRange(e: Entity, v: Vec): boolean {
      if (!isArgs([v], isVec)) return false;
      return dist(e.pos, v) <= 1;
    },
    findClosestEntity(e: Entity, entityType: EntityType): Entity | null {
      if (!isArgs([entityType], isString)) return null;
      return game.findClosestEntity(e.pos, entityType);
    },
  },
  act: {
    MOVE_NEXT_TO: (e: Entity, v: Vec): MOVE_NEXT_TO => ({
      __type: "MOVE_NEXT_TO",
      id: e.id,
      v: v,
    }),
    MINE: (e: Entity, v: Vec): MINE => ({ __type: "MINE", v: v, id: e.id }),
    ATTUNE: (e: Entity): ATTUNE => ({ __type: "ATTUNE", id: e.id }),
    DIE: (e: Entity): DIE => ({ __type: "DIE", id: e.id }),
    SMASH: (e: Entity, id: number): SMASH => ({
      __type: "SMASH",
      id: e.id,
      target: id,
    }),
  },
};
