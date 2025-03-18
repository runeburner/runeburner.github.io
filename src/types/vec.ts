export type Vec = [number, number];

// We're not looking for euclidean distance, we're looking for spaces away
// including diagonals
export const dist = (v0: Vec, v1: Vec): number =>
  Math.max(Math.abs(v0[0] - v1[0]), Math.abs(v0[1] - v1[1]));

export const eq = (v0: Vec, v1: Vec): boolean =>
  v0[0] === v1[0] && v0[1] === v1[1];

export const sub = (v0: Vec, v1: Vec): Vec => [v0[0] - v1[0], v0[1] - v1[1]];
