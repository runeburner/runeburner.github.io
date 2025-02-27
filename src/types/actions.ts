import { Action } from "../World/Action/Action";
import { Entity } from "./entity";
import { Vec } from "./vec";

export const ActionType = Object.freeze({
  GOLEM_MOVE: "GOLEM_MOVE",
  MINE: "MINE",
  ATTUNE: "ATTUNE",
} as const);

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export type Action<
  T extends ActionType = ActionType,
  V extends object = object
> = {
  type: T;
  id: number;
  entityID: number;
  pos: Vec;
} & V;

export type MoveAction = Action<
  typeof ActionType.GOLEM_MOVE,
  {
    goal: Vec;
    progress: Vec;
    path: Vec[];
  }
>;

export type MineAction = Action<
  typeof ActionType.MINE,
  {
    progress: Vec;
    tile: Vec;
  }
>;

export type AttuneAction = Action<
  typeof ActionType.ATTUNE,
  {
    heartPos: Vec;
    progress: Vec;
  }
>;

export type ActionDataMap = {
  [ActionType.GOLEM_MOVE]: MoveAction;
  [ActionType.MINE]: MineAction;
  [ActionType.ATTUNE]: AttuneAction;
};

export type ActionHandlers = {
  [T in ActionType]: (e: Entity, a: ActionDataMap[T]) => boolean;
};
