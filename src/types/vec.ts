export type Vec = [number, number];

export const dist = (v0: Vec, v1: Vec): number =>
  Math.sqrt(Math.pow(v0[0] - v1[0], 2) + Math.pow(v0[1] - v1[1], 2));

export const eq = (v0: Vec, v1: Vec): boolean =>
  v0[0] === v1[0] && v0[1] === v1[1];
