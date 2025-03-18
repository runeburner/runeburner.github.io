import { Typed } from "./typed_object";
import { Vec } from "./vec";

export const ActionType = Object.freeze({
  MOVE_NEXT_TO: "MOVE_NEXT_TO",
  MINE: "MINE",
  ATTUNE: "ATTUNE",
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

type BaseActionProgress<
  T extends ActionType = ActionType,
  V extends object = object
> = Typed<T, { pos: Vec } & V>;

export type MOVE_NEXT_TOProgress = BaseActionProgress<
  typeof ActionType.MOVE_NEXT_TO,
  {
    goal: Vec;
    progress: Vec;
    path: Vec[];
  }
>;

export type MINEProgress = BaseActionProgress<
  typeof ActionType.MINE,
  {
    progress: Vec;
    tile: Vec;
  }
>;

export type ATTUNEProgress = BaseActionProgress<
  typeof ActionType.ATTUNE,
  {
    progress: Vec;
    heart: Vec;
  }
>;

export type ActionProgress =
  | MOVE_NEXT_TOProgress
  | MINEProgress
  | ATTUNEProgress;

export type ActionTypeMap = {
  [ActionType.MOVE_NEXT_TO]: [MOVE_NEXT_TO, MOVE_NEXT_TOProgress];
  [ActionType.MINE]: [MINE, MINEProgress];
  [ActionType.ATTUNE]: [ATTUNE, ATTUNEProgress];
};
