// This file is ONLY used by the text editor. Not by the game itself.
type World = {
  findClosestTile: (tile: string, radius: number) => Promise<[number, number]>;
  goNextTo: (pos: [number, number]) => Promise<unknown>;
  mine: (pos: [number, number]) => Promise<unknown>;
  ping: () => Promise<string>;
  attune: () => Promise<void>;
};

declare const world: World;
declare const run: (f: () => Promise<void>) => void;
