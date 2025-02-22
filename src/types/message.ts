import { Action } from "./actions";
import { Entity } from "./entity";
import { Rune } from "./rune";

export type UIChannel = {
  onmessage:
    | ((this: BroadcastChannel, ev: MessageEvent<UIMessage>) => void)
    | null;
  postMessage: (message: UIMessage) => void;
};

export const MessageType = Object.freeze({
  INITIALIZE: "INITIALIZE",
  QUERY: "QUERY",
  MAP: "MAP",
  ANIMATE: "ANIMATE",
  ADD_ENTITY: "ADD_ENTITY",
  ADD_ACTION: "ADD_ACTION",
  UPDATE_ENTITY: "UPDATE_ENTITY",
  UPDATE_ACTION: "UPDATE_ACTION",
} as const);

type MessageType = (typeof MessageType)[keyof typeof MessageType];

export type Camera = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GenericMessage = {
  type: MessageType;
};

type InitializeMessage = {
  type: typeof MessageType.INITIALIZE;
  data: Camera;
} & GenericMessage;

type MapDataMessage = {
  type: typeof MessageType.MAP;
  data: {
    map: {
      width: number;
      height: number;
      data: Int32Array;
    };
    x: number;
    y: number;
    entities: Entity[];
    actions: Action[];
    camera?: Camera;
  };
} & GenericMessage;

type QueryMessage = {
  type: typeof MessageType.QUERY;
  data: Camera;
} & GenericMessage;

type AnimateMessage = {
  type: typeof MessageType.ANIMATE;
  data: {
    runes: [Rune, number][];
    incantation: string;
  };
};

type AddEntityMessage = {
  type: typeof MessageType.ADD_ENTITY;
  data: Entity;
};

type AddActionMessage = {
  type: typeof MessageType.ADD_ACTION;
  data: Action;
};

type UpdateEntity = {
  type: typeof MessageType.UPDATE_ENTITY;
  data: Entity;
};

type UpdateAction = {
  type: typeof MessageType.UPDATE_ACTION;
  data: Action;
};

export type UIMessage =
  | InitializeMessage
  | MapDataMessage
  | QueryMessage
  | AnimateMessage
  | AddEntityMessage
  | AddActionMessage
  | UpdateEntity
  | UpdateAction;
