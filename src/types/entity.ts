import { Rune } from "./rune";
import { Typed } from "./typed_object";
import { Vec } from "./vec";

export const EntityType = Object.freeze({
  HEART: "HEART",
  GOLEM: "GOLEM",
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
    speed: number;
    weight: number;
    mineSpeed: number;
    minecapacity: Vec;
    runes: [Rune, number][];
    mana: Vec;
  }
>;

export type Entity = HeartEntity | GolemEntity;
