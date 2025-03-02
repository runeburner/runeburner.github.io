import { Vec } from "./vec";

export const ActionType = Object.freeze({
  MOVE: "MOVE",
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
} & V;

export type MOVE = Action<typeof ActionType.MOVE, { v: Vec }>;
export type MINE = Action<typeof ActionType.MINE, { v: Vec }>;
export type ATTUNE = Action<typeof ActionType.ATTUNE>;

export type ActionProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = {
  type: T;
} & V;

export type MOVEProgress = ActionProgress<
  typeof ActionType.MOVE,
  {
    goal: Vec;
    progress: Vec;
    path: Vec[];
  }
>;

export type MINEProgress = ActionProgress<
  typeof ActionType.MINE,
  {
    pos: Vec;
    progress: Vec;
    tile: Vec;
  }
>;

export type ATTUNEProgress = ActionProgress<
  typeof ActionType.ATTUNE,
  {
    progress: Vec;
    pos: Vec;
    heart: Vec;
  }
>;

export type ActionTypeMap = {
  [ActionType.MOVE]: [MOVE, MOVEProgress];
  [ActionType.MINE]: [MINE, MINEProgress];
  [ActionType.ATTUNE]: [ATTUNE, ATTUNEProgress];
};
