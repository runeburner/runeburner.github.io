// This file is ONLY used by the text editor. Not by the game itself.
type Vec = [number, number];
type RS = {
  findNearest(tile: string, radius: number): Vec | null;
  findAll(tile: string, radius: number): Vec[];
  me(): unknown;
  at(v: Vec): Int32Array;
  isInRange(v: Vec): boolean;
  findClosestEntity(entityType: string): unknown | null;
};

declare const MOVE_NEXT_TO: (v: Vec) => unknown;
declare const MINE: (v: Vec) => unknown;
declare const ATTUNE: () => unknown;
declare const DIE: () => unknown;
declare const SMASH: (id: number) => unknown;
