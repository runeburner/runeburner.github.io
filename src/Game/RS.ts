import { Entity, EntityType } from "../types/entity";
import { Tile } from "../types/tile";
import { dist } from "../types/vec";
import { game } from "./game";
import { isArgs, isNumber, isString, isVec } from "./validation";

export const rs = {
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
};
