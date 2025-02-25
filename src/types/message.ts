import { Action } from "./actions";
import { Entity } from "./entity";
import { Rune } from "./rune";
import { Vec } from "./vec";

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
  pos: Vec;
  size: Vec;
};

export type GenericMessage = {
  type: MessageType;
};

export type InitializeMessage = {
  type: typeof MessageType.INITIALIZE;
  data: Camera;
} & GenericMessage;

export type MapData = {
  map: {
    width: number;
    height: number;
    data: Int32Array;
  };
  pos: Vec;
  entities: string[];
  actions: string[];
  camera?: Camera;
};

export type MapDataMessage = {
  type: typeof MessageType.MAP;
  data: MapData;
} & GenericMessage;

export type QueryMessage = {
  type: typeof MessageType.QUERY;
  data: Camera;
} & GenericMessage;

export type AnimateMessage = {
  type: typeof MessageType.ANIMATE;
  data: {
    runes: [Rune, number][];
    incantation: string;
  };
};

export type AddEntityMessage = {
  type: typeof MessageType.ADD_ENTITY;
  data: string;
};

export type AddActionMessage = {
  type: typeof MessageType.ADD_ACTION;
  data: string;
};

export type UpdateEntityMessage = {
  type: typeof MessageType.UPDATE_ENTITY;
  data: Entity;
};

export type UpdateActionmessage = {
  type: typeof MessageType.UPDATE_ACTION;
  data: Action;
};

export type RefreshEntityMessage = {
  type: typeof MessageType.REFRESH_ENTITY;
  data: string;
};

export type RefreshActionMessage = {
  type: typeof MessageType.REFRESH_ACTION;
  data: string;
};
export type RemoveEntityMessage = {
  type: typeof MessageType.REMOVE_ENTITY;
  data: string;
};

export type RemoveActionMessage = {
  type: typeof MessageType.REMOVE_ACTION;
  data: string;
};

type MessageTypeMap = {
  [MessageType.INITIALIZE]: InitializeMessage;
  [MessageType.QUERY]: QueryMessage;
  [MessageType.MAP]: MapDataMessage;
  [MessageType.ANIMATE]: AnimateMessage;
  [MessageType.ADD_ENTITY]: AddEntityMessage;
  [MessageType.ADD_ACTION]: AddActionMessage;
  [MessageType.UPDATE_ENTITY]: UpdateEntityMessage;
  [MessageType.UPDATE_ACTION]: UpdateActionmessage;
  [MessageType.REFRESH_ENTITY]: RefreshEntityMessage;
  [MessageType.REFRESH_ACTION]: RefreshActionMessage;
  [MessageType.REMOVE_ENTITY]: RemoveEntityMessage;
  [MessageType.REMOVE_ACTION]: RemoveActionMessage;
};

export type MessageHandlers = {
  [Type in keyof MessageTypeMap]?: (msg: MessageTypeMap[Type]) => void;
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
