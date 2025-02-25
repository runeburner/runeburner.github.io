// First int is the tile id, second is the metadata like durability, mana count, etc
export const ValuesPerTile = 2;

export type Map = {
  width: number;
  height: number;
  data: Int32Array;
};
