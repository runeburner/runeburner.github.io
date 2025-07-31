import { AABB } from "./aabb";

// First int is the tile id, second is the fog of war count.
export const ValuesPerTile = 2;

export const Offset = Object.freeze({
  TILE_ID: 0,
  FOG_OF_WAR: 1,
} as const);

export type Offset = (typeof Offset)[keyof typeof Offset];

export type Plane = {
  bounds: AABB;
  data: Int32Array;
};
