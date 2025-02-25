import { Vec } from "./vec";

export const ActionType = Object.freeze({
  GOLEM_MOVE: "GOLEM_MOVE",
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
  progress: Vec;
  path: Vec[];
} & BaseAction;

export type Action = MoveAction;
