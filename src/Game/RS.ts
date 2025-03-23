import { Entity, EntityType } from "../types/entity";
import { Tile } from "../types/tile";
import { dist } from "../types/vec";
import { game } from "./game";
import { isArgs, isNumber, isString, isVec } from "./validation";

export const RS = {
  findNearest(e: Entity, tile: keyof typeof Tile, radius: number): Vec | null {
    if (!isArgs([tile, radius], isString, isNumber)) return null;
    return game.findClosestTile(e.pos, Tile[tile], radius);
  },
  findAll(e: Entity, tile: keyof typeof Tile, radius: number): Vec[] {
    if (!isArgs([tile, radius], isString, isNumber)) return [];
    return game.findAllTiles(e.pos, Tile[tile], radius);
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
