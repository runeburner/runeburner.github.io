import { Rune } from "./rune";
import { Vec } from "./vec";

export const EntityType = Object.freeze({
  HEART: "HEART",
  GOLEM: "GOLEM",
} as const);

export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export type BaseEntity = {
  type: EntityType;
  id: number;
  pos: Vec;
};

export type HeartEntity = {
  type: typeof EntityType.HEART;
} & BaseEntity;

export type GolemEntity = {
  type: typeof EntityType.GOLEM;
  speed: number;
  weight: number;
  mineSpeed: number;
  minecapacity: Vec;
  runes: [Rune, number][];
} & BaseEntity;

export type Entity = HeartEntity | GolemEntity;
