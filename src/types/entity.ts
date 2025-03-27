import { Rune } from "./rune";
import { Typed } from "./typed_object";
import { Vec } from "./vec";

export const EntityType = Object.freeze({
  HEART: "HEART",
  GOLEM: "GOLEM",
  DUMMY: "DUMMY",
} as const);

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export type BaseEntity<T extends EntityType, V extends object> = Typed<
  T,
  {
    id: number;
    visionRange: number;
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
    attunement: number;
  }
>;

export type GolemEntity = HealthEntity<
  typeof EntityType.GOLEM,
  {
    runeCrystals: number;
    runes: Record<Rune, number>;
    mana: Vec;
  }
>;

export type DummyEntity = HealthEntity<typeof EntityType.DUMMY, object>;

export type Entity = HeartEntity | GolemEntity | DummyEntity;
