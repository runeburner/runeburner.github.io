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
  REFRESH_ENTITY: "REFRESH_ENTITY",
  REFRESH_ACTION: "REFRESH_ACTION",
  REMOVE_ENTITY: "REMOVE_ENTITY",
  REMOVE_ACTION: "REMOVE_ACTION",
} as const);

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

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

export type MapData = {
  map: {
    width: number;
    height: number;
    data: Int32Array;
  };
  x: number;
  y: number;
  entities: string[];
  actions: string[];
  camera?: Camera;
};

type MapDataMessage = {
  type: typeof MessageType.MAP;
  data: MapData;
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
  data: string;
};

type AddActionMessage = {
  type: typeof MessageType.ADD_ACTION;
  data: string;
};

type UpdateEntityMessage = {
  type: typeof MessageType.UPDATE_ENTITY;
  data: Entity;
};

type UpdateActionmessage = {
  type: typeof MessageType.UPDATE_ACTION;
  data: Action;
};

type RefreshEntityMessage = {
  type: typeof MessageType.REFRESH_ENTITY;
  data: string;
};

type RefreshActionMessage = {
  type: typeof MessageType.REFRESH_ACTION;
  data: string;
};
type RemoveEntityMessage = {
  type: typeof MessageType.REMOVE_ENTITY;
  data: string;
};

type RemoveActionMessage = {
  type: typeof MessageType.REMOVE_ACTION;
  data: string;
};

export type UIMessage =
  | InitializeMessage
  | MapDataMessage
  | QueryMessage
  | AnimateMessage
  | AddEntityMessage
  | AddActionMessage
  | UpdateEntityMessage
  | UpdateActionmessage
  | RefreshEntityMessage
  | RefreshActionMessage
  | RemoveEntityMessage
  | RemoveActionMessage;
