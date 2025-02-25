export const Tile = Object.freeze({
  EMPTY: 0,
  MANA_CRYSTAL: 1,
} as const);

export type Tile = (typeof Tile)[keyof typeof Tile];

export const AStarDist: Record<number, number> = {
  [Tile.EMPTY]: 1,
  [Tile.MANA_CRYSTAL]: Infinity,
};
