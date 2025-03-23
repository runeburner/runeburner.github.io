import { Typed } from "./typed_object";
import { Vec } from "./vec";

export const ActionType = Object.freeze({
  IDLE: "IDLE",
  MOVE_NEXT_TO: "MOVE_NEXT_TO",
  MINE: "MINE",
  ATTUNE: "ATTUNE",
  DIE: "DIE",
  SMASH: "SMASH",
} as const);

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export type Action<
  T extends ActionType = ActionType,
  V extends object = object
> = Typed<
  T,
  {
    id: number;
  } & V
>;

export type MOVE_NEXT_TO = Action<typeof ActionType.MOVE_NEXT_TO, { v: Vec }>;
export type MINE = Action<typeof ActionType.MINE, { v: Vec }>;
export type ATTUNE = Action<typeof ActionType.ATTUNE>;
export type DIE = Action<typeof ActionType.DIE>;
export type SMASH = Action<typeof ActionType.SMASH, { target: number }>;
export type IDLE = Action<typeof ActionType.IDLE>;

type BaseActionProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = Typed<T, { pos: Vec; progress: Vec } & V>;

export type MOVE_NEXT_TOProgress = BaseActionProgress<
  typeof ActionType.MOVE_NEXT_TO,
  {
    goal: Vec;
    path: Vec[];
  }
>;

export type MINEProgress = BaseActionProgress<
  typeof ActionType.MINE,
  {
    tile: Vec;
  }
>;

export type ATTUNEProgress = BaseActionProgress<
  typeof ActionType.ATTUNE,
  {
    heart: Vec;
  }
>;

export type TargettedProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = BaseActionProgress<T, { target: number } & V>;

export type SMASHProgress = TargettedProgress<typeof ActionType.SMASH>;

export type ActionProgress =
  | MOVE_NEXT_TOProgress
  | MINEProgress
  | ATTUNEProgress
  | SMASHProgress;

export type ActionTypeMap = {
  [ActionType.IDLE]: [IDLE, void];
  [ActionType.MOVE_NEXT_TO]: [MOVE_NEXT_TO, MOVE_NEXT_TOProgress];
  [ActionType.MINE]: [MINE, MINEProgress];
  [ActionType.ATTUNE]: [ATTUNE, ATTUNEProgress];
  [ActionType.DIE]: [DIE, void];
  [ActionType.SMASH]: [SMASH, SMASHProgress];
};
