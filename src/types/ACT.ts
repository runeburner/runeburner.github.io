import { Vec } from "./vec";

export const ACTType = Object.freeze({
  MOVE: "MOVE",
  MINE: "MINE",
  ATTUNE: "ATTUNE",
} as const);

export type ACTType = (typeof ACTType)[keyof typeof ACTType];

export type ACT<T extends ACTType = ACTType, V extends object = object> = {
  type: T;
  id: number;
} & V;

export type MOVE = ACT<typeof ACTType.MOVE, { v: Vec }>;
export type MINE = ACT<typeof ACTType.MINE, { v: Vec }>;
export type ATTUNE = ACT<typeof ACTType.ATTUNE>;

export type ACTProgress<
  T extends ACTType = ACTType,
  V extends object = object
> = {
  type: T;
} & V;

export type MOVEProgress = ACTProgress<
  typeof ACTType.MOVE,
  {
    goal: Vec;
    progress: Vec;
    path: Vec[];
  }
>;

export type MINEProgress = ACTProgress<
  typeof ACTType.MINE,
  {
    pos: Vec;
    progress: Vec;
    tile: Vec;
  }
>;

export type ATTUNEProgress = ACTProgress<
  typeof ACTType.ATTUNE,
  {
    progress: Vec;
    pos: Vec;
    heart: Vec;
  }
>;

export type ACTTypeMap = {
  [ACTType.MOVE]: [MOVE, MOVEProgress];
  [ACTType.MINE]: [MINE, MINEProgress];
  [ACTType.ATTUNE]: [ATTUNE, ATTUNEProgress];
};
