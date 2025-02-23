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
  path: [number, number][];
} & BaseAction;

export type Action = MoveAction;
