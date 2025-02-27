export type Vec = [number, number];

export const dist = (v0: Vec, v1: Vec): number =>
  Math.abs(v0[0] - v1[0]) + Math.abs(v0[1] - v1[1]);
