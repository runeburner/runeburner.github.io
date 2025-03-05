import { AABB } from "./aabb";

// First int is the tile id, second is the metadata like durability, mana count, etc
export const ValuesPerTile = 3;

export const Offset = Object.freeze({
  TILE_ID: 0,
  FOG_OF_WAR: 1,
  DATA_0: 2,
} as const);

export type Offset = (typeof Offset)[keyof typeof Offset];

export type Map = {
  bounds: AABB;
  data: Int32Array;
};
