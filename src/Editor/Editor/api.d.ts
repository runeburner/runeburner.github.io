type Vec = [number, number];

type Action = { __type: string };

type RS = {
  game: {
    /**
     * Search for a given type of tile.
     * @param tile The type of tile to search for.
     * @param radius The maximum search radius around this entity.
     * @returns The closest tile of that type if found, null if none is found.
     */
    findNearest(tile: Tile, radius: number): Vec | null;
    /**
     * Search for all tiles of a given type.
     * @param tile The type of tile to search for.
     * @param radius The maximum search radius around this entity.
     * @returns The list of all tiles of the given type that are within the search radius.
     */
    findAll(tile: Tile, radius: number): Vec[];
    /**
     * Find the entity of the given type that is closest to this entity.
     * @param entityType The type of entity to find.
     * @returns The entity if found, null if not.
     */
    findClosestEntity(entityType: EntityType): Entity | null;
    /**
     * Inspect a given tile, returning the underlying data.
     * @param v The tile to inspect.
     * @returns The raw data representing the tile at `v`.
     */
    at(v: Vec): Int32Array;
  };
  act: {
    /**
     * Moves this entity next to the given tile.
     * @param v The tile to move towards.
     * @returns An `Action` to be returned by the global `tick` function.
     *  */
    MOVE_NEXT_TO(v: Vec): Action;
    /**
     * Mine a tile. The effect depends on the tile.
     * @param v The tile to mine.
     * @returns An `Action` to be returned by the global `tick` function.
     */
    MINE(v: Vec): Action;
    /**
     * Converts Rune Crystals to Musical Notes.
     * @returns An `Action` to be returned by the global `tick` function.
     * */
    SING(): Action;
    /**
     * Remove the golem from the map.
     * @returns An `Action` to be returned by the global `tick` function.
     */
    DIE(): Action;
    /**
     * Attack another entity.
     * @param id The entity ID to attack.
     * @returns An `Action` to be returned by the global `tick` function.
     */
    SMASH(id: number): Action;
  };
  me: {
    /**
     * Get the number of Rune Crystal that this entity is currently holding.
     * @returns The number of Rune Crystal that this entity is currently holding. */
    runeCrystals(): number;
    /** Get the number of Rune Crystal that this entity can hold.
     * @returns The number of Rune Crystal that this entity can hold.
     */
    runeCrystalCapacity(): number;
    /**
     * Check if this entity can interact with the given tile.
     * @param v The tile this entity is attempting to interact with.
     * @returns true if the entity is in range of `v`, false if not.
     */
    isInRange(v: Vec): boolean;
    /**
     * Check if this entity has a path to reach the given tile.
     * @param v The tile this entity is attempting to reach.
     * @returns true if the entity can reach `v`, false if not.
     */
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
