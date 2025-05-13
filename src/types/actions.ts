import { Typed } from "./typed_object";
import { Vec } from "./vec";

export const ActionType = Object.freeze({
  IDLE: "IDLE",
  MOVE_NEXT_TO: "MOVE_NEXT_TO",
  MINE: "MINE",
  SING: "SING",
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
export type SING = Action<typeof ActionType.SING>;
export type DIE = Action<typeof ActionType.DIE>;
export type SMASH = Action<typeof ActionType.SMASH, { target: number }>;
export type IDLE = Action<typeof ActionType.IDLE>;

type BaseActionProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = Typed<T, { pos: Vec; progress: Vec } & V>;

export type TargettedProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = BaseActionProgress<T, { target: number } & V>;

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

export type SINGProgress = BaseActionProgress<
  typeof ActionType.SING,
  {
    heart: Vec;
  }
>;

export type SMASHProgress = TargettedProgress<typeof ActionType.SMASH>;

export type ActionProgress =
  | MOVE_NEXT_TOProgress
  | MINEProgress
  | SINGProgress
  | SMASHProgress;

export type ActionHandler = {
  [ActionType.IDLE]: [IDLE, void];
  [ActionType.MOVE_NEXT_TO]: [MOVE_NEXT_TO, MOVE_NEXT_TOProgress];
  [ActionType.MINE]: [MINE, MINEProgress];
  [ActionType.SING]: [SING, SINGProgress];
  [ActionType.DIE]: [DIE, void];
  [ActionType.SMASH]: [SMASH, SMASHProgress];
};
