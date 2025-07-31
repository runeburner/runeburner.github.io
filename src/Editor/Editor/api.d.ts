/**
 * A 2 dimentional vector.
 */
type Vec = [number, number];

/**
 * An object that must be returned by the global `tick` function in order to indicate what the entity will do during this tick.
 */
type Action = { __type: string };

type RSMemory = object;

type RSWorld = {
  /**
   * Search for all entities of a given type.
   * @param entityType The type of entity to search for.
   * @param radius The maximum search radius around this entity.
   * @returns The list of all entities of the given type that are within the search parameters.
   */
  findAll(entityType: EntityType, radius: number): Entity[];
  /**
   * Find the entity of the given type that is closest to this entity.
   * @param entityType The type of entity to find.
   * @returns The entity if found, null if not.
   */
  findClosestEntity(entityType: EntityType): Entity | null;
};

type RSAct = {
  /**
   * Moves this entity next to the given location.
   * @param v The location to move towards.
   * @returns An `Action` to be returned by the global `tick` function.
   *  */
  MOVE_NEXT_TO(v: Vec): Action;
  /**
   * Mine an entity. The effect depends on the entity.
   * @param v The entity to mine.
   * @returns An `Action` to be returned by the global `tick` function.
   */
  MINE(id: number): Action;
  /**
   * Converts Rune Crystals to Musical Notes.
   * @returns An `Action` to be returned by the global `tick` function.
   */
  SING(): Action;
  /**
   * Remove the golem from the map, restoring 1 life.
   * @returns An `Action` to be returned by the global `tick` function.
   */
  FADE(): Action;
  /**
   * Attack another entity.
   * @param id The entity ID to attack.
   * @returns An `Action` to be returned by the global `tick` function.
   */
  SMASH(id: number): Action;
  /**
   * Do nothing
   * @returns An `Action` to be returned by the global `tick` function.
   */
  IDLE(): Action;
};

type RSMe = {
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

/**
 * An object containing all the functions that incantations need to control entities.
 */
type RS = {
  /**
   * Contains all functions related to querying the map.
   */
  world: RSWorld;
  /**
   * Contains all functions that generate `Action`s to be returned by `tick`.
   */
  act: RSAct;
  /**
   * Contains all functions related to the current entity.
   */
  me: RSMe;
};

/**
 * The type for the global function `tick`. Which every incantation must have.
 */
type Ticker = (rs: RS) => Action;

/**
 * All possible Tile type
 */
declare const Tile: Readonly<{
  readonly EMPTY: 0;
}>;

/**
 * Typed object can be used to differentiate between types.
 */
declare type Typed<T, V> = {
  __type: T;
} & V;

/**
 * All possible entity type
 */
declare const EntityType = Object.freeze({
  HEART: "HEART",
  GOLEM: "GOLEM",
  DUMMY: "DUMMY",
  ROCK: "ROCK",
  RUNE_CRYSTAL: "RUNE_CRYSTAL",
} as const);

declare type EntityType = (typeof EntityType)[keyof typeof EntityType];

declare type BaseEntity<T extends EntityType, V extends object> = Typed<
  T,
  {
    id: number;
    pos: Vec;
  } & V
>;

declare type HealthEntity<T extends EntityType, V extends object> = BaseEntity<
  T,
  {
    health: Vec;
    armor: Vec;
    shield: Vec;
  } & V
>;

declare type HeartEntity = HealthEntity<
  typeof EntityType.HEART,
  {
    visionRange: number;
  }
>;

declare type GolemEntity = HealthEntity<
  typeof EntityType.GOLEM,
  {
    runeCrystals: number;
    runes: Record<Rune, number>;
    mana: Vec;
    eldritchRune?: EldritchRune;
    visionRange: number;
  }
>;

declare type DummyEntity = HealthEntity<typeof EntityType.DUMMY, object>;

declare type MineableEntity<T extends EntityType> = BaseEntity<
  T,
  {
    quantity: number;
    hardness: number;
  }
>;

declare type RockEntity = MineableEntity<typeof EntityType.ROCK>;

declare type RuneCrystalEntity = MineableEntity<typeof EntityType.RUNE_CRYSTAL>;

/**
 * All entity types
 */
declare type Entity =
  | HeartEntity
  | GolemEntity
  | DummyEntity
  | RockEntity
  | RuneCrystalEntity;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Memory: any;

declare interface Window {
  /**
   * All different types of tiles.
   */
  Tile: typeof Tile;
  /**
   * All different types of entities.
   */
  EntityType: typeof EntityType;
  /**
   * An object shared between all incantations. Used for communication. To be used at the players discretion.
   */
  Memory: RSMemory;
}
