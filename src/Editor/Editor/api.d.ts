// This file is ONLY used by the text editor. Not by the game itself.
type Vec = [number, number];
type RS = {
  findNearest(e: Entity, tile: string, radius: number): Vec | null;
  me(e: Entity): Entity;
  isInRange(e: Entity, v: Vec): boolean;
  findClosestEntity(e: Entity, entityType: string): Vec | null;
};

declare const MOVE: (v: Vec) => unknown;
declare const MINE: (v: Vec) => unknown;
declare const ATTUNE: () => unknown;
