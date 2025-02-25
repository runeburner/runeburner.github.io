import { Vec } from "./vec";

export const ActionType = Object.freeze({
  GOLEM_MOVE: "GOLEM_MOVE",
  MINE: "MINE",
} as const);

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

type BaseAction = {
  type: ActionType;
  id: string;
  entityID: string;
  x: number;
  y: number;
};

export type MoveAction = {
  type: typeof ActionType.GOLEM_MOVE;
  progress: Vec;
  path: Vec[];
} & BaseAction;

export type MineAction = {
  type: typeof ActionType.MINE;
  progress: Vec;
  tile: Vec;
} & BaseAction;

export type Action = MoveAction | MineAction;
