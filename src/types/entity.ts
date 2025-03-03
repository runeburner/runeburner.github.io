import { Rune } from "./rune";
import { Vec } from "./vec";

export const EntityType = Object.freeze({
  HEART: "HEART",
  GOLEM: "GOLEM",
} as const);

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export type BaseEntity<T extends object> = {
  type: EntityType;
  id: number;
  pos: Vec;
} & T;

export type HeartEntity = BaseEntity<{
  type: typeof EntityType.HEART;
  attunement: number;
  health: Vec;
  armor: Vec;
  shield: Vec;
}>;

export type GolemEntity = BaseEntity<{
  type: typeof EntityType.GOLEM;
  speed: number;
  weight: number;
  mineSpeed: number;
  minecapacity: Vec;
  runes: [Rune, number][];
  health: Vec;
  armor: Vec;
  shield: Vec;
  mana: Vec;
}>;

export type Entity = HeartEntity | GolemEntity;
