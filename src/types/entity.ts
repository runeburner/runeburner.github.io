import { EldritchRune } from "./eldritchRunes";
import { Rune } from "./rune";
import { Typed } from "./typed_object";
import { Vec } from "./vec";

export const EntityType = Object.freeze({
  HEART: "HEART",
  GOLEM: "GOLEM",
  DUMMY: "DUMMY",
  ROCK: "ROCK",
  RUNE_CRYSTAL: "RUNE_CRYSTAL",
} as const);

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export type BaseEntity<T extends EntityType, V extends object> = Typed<
  T,
  {
    id: number;
    pos: Vec;
  } & V
>;

export type HealthEntity<T extends EntityType, V extends object> = BaseEntity<
  T,
  {
    health: Vec;
    armor: Vec;
    shield: Vec;
  } & V
>;

export type HeartEntity = HealthEntity<
  typeof EntityType.HEART,
  {
    visionRange: number;
  }
>;

export type GolemEntity = HealthEntity<
  typeof EntityType.GOLEM,
  {
    runeCrystals: number;
    runes: Record<Rune, number>;
    mana: Vec;
    eldritchRune?: EldritchRune;
    visionRange: number;
  }
>;

export type DummyEntity = HealthEntity<typeof EntityType.DUMMY, object>;

export type MineableEntity<T extends EntityType> = BaseEntity<
  T,
  {
    quantity: number;
    hardness: number;
  }
>;

export type RockEntity = MineableEntity<typeof EntityType.ROCK>;

export type RuneCrystalEntity = MineableEntity<typeof EntityType.RUNE_CRYSTAL>;

export type Entity =
  | HeartEntity
  | GolemEntity
  | DummyEntity
  | RockEntity
  | RuneCrystalEntity;
