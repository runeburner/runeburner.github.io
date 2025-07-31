export const Tile = Object.freeze({
  EMPTY: 0,
} as const);

export type Tile = (typeof Tile)[keyof typeof Tile];

export const EnterWeight: { [T in Tile]: number } = {
  [Tile.EMPTY]: 1,
};
