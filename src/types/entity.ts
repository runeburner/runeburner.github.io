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
    pos: Vec;
  } & V
>;

export type HeartEntity = BaseEntity<
  typeof EntityType.HEART,
  {
    attunement: number;
    health: Vec;
    armor: Vec;
    shield: Vec;
  }
>;

export type GolemEntity = BaseEntity<
  typeof EntityType.GOLEM,
  {
    speed: number;
    weight: number;
    mineSpeed: number;
    minecapacity: Vec;
    runes: [Rune, number][];
    health: Vec;
    armor: Vec;
    shield: Vec;
    mana: Vec;
  }
>;

export type Entity = HeartEntity | GolemEntity;
