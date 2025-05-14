type Vec = [number, number];

type Action = unknown;

type RS = {
  game: {
    findNearest(tile: Tile, radius: number): Vec | null;
    findAll(tile: Tile, radius: number): Vec[];
    findClosestEntity(entityType: EntityType): Entity | null;
    at(v: Vec): Int32Array;
  };
  act: {
    MOVE_NEXT_TO(v: Vec): Action;
    MINE(v: Vec): Action;
    SING(): Action;
    DIE(): Action;
    SMASH(id: number): Action;
  };
  me: {
    runeCrystals(): number;
    runeCrystalCapacity(): number;
    isInRange(v: Vec): boolean;
    hasPathTo(v: Vec): boolean;
  };
};

type Ticker = (rs: RS) => Action;

declare const Tile: Readonly<{
  readonly EMPTY: 0;
  readonly RUNE_CRYSTAL: 1;
  readonly ROCK: 2;
}>;

declare const EntityType: Readonly<{
  readonly HEART: "HEART";
  readonly GOLEM: "GOLEM";
  readonly DUMMY: "DUMMY";
}>;

declare interface Window {
  Tile: typeof Tile;
  EntityType: typeof EntityType;
}
