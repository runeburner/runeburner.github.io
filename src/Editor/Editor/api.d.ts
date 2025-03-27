type Vec = [number, number];

type RS = {
  game: {
    findNearest(e: Entity, tile: Tile, radius: number): Vec | null;
    findAll(e: Entity, tile: Tile, radius: number): Vec[];
    me(e: Entity): Entity;
    isInRange(e: Entity, v: Vec): boolean;
    findClosestEntity(e: Entity, entityType: EntityType): Entity | null;
  };
  act: {
    MOVE_NEXT_TO: (v: Vec) => unknown;
    MINE: (v: Vec) => unknown;
    ATTUNE: () => unknown;
    DIE: () => unknown;
    SMASH: (id: number) => unknown;
  };
};

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
