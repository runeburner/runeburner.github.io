import { Action } from "./actions";
import { Entity } from "./entity";
import { Rune } from "./rune";
import { Vec } from "./vec";

export type UIChannel = {
  onmessage:
    | (<T extends MessageType>(
        this: BroadcastChannel,
        ev: MessageEvent<Message<T, MessageDataMap[T]>>
      ) => void)
    | null;
  postMessage: <T extends MessageType>(
    message: Message<T, MessageDataMap[T]>
  ) => void;
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

export type Message<K extends MessageType, V> = {
  type: K;
  data: V;
};

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

export type MessageDataMap = {
  [MessageType.INITIALIZE]: Camera;
  [MessageType.QUERY]: Camera;
  [MessageType.MAP]: MapData;
  [MessageType.ANIMATE]: {
    runes: [Rune, number][];
    incantation: string;
  };
  [MessageType.ADD_ENTITY]: string;
  [MessageType.ADD_ACTION]: string;
  [MessageType.UPDATE_ENTITY]: Entity;
  [MessageType.UPDATE_ACTION]: Action;
  [MessageType.REFRESH_ENTITY]: string;
  [MessageType.REFRESH_ACTION]: string;
  [MessageType.REMOVE_ENTITY]: string;
  [MessageType.REMOVE_ACTION]: string;
};

export type MessageHandlers = {
  [Type in keyof MessageDataMap]?: (msg: MessageDataMap[Type]) => void;
};
