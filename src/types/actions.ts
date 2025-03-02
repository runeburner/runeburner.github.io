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

type BaseActionProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = {
  type: T;
} & V;

export type MOVEProgress = BaseActionProgress<
  typeof ActionType.MOVE,
  {
    goal: Vec;
    progress: Vec;
    path: Vec[];
  }
>;

export type MINEProgress = BaseActionProgress<
  typeof ActionType.MINE,
  {
    pos: Vec;
    progress: Vec;
    tile: Vec;
  }
>;

export type ATTUNEProgress = BaseActionProgress<
  typeof ActionType.ATTUNE,
  {
    progress: Vec;
    pos: Vec;
    heart: Vec;
  }
>;

export type ActionProgress = MOVEProgress | MINEProgress | ATTUNEProgress;

export type ActionTypeMap = {
  [ActionType.MOVE]: [MOVE, MOVEProgress];
  [ActionType.MINE]: [MINE, MINEProgress];
  [ActionType.ATTUNE]: [ATTUNE, ATTUNEProgress];
};
