export const Tile = Object.freeze({
  EMPTY: 0,
  RUNE_CRYSTAL: 1,
  ROCK: 2,
} as const);

export type Tile = (typeof Tile)[keyof typeof Tile];

export const EnterWeight: { [T in Tile]: number } = {
  [Tile.EMPTY]: 1,
  [Tile.RUNE_CRYSTAL]: Infinity,
  [Tile.ROCK]: Infinity,
};
