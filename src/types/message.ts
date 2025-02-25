import { Action } from "./actions";
import { Entity } from "./entity";
import { Rune } from "./rune";
import { Vec } from "./vec";

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

export type MainThreadMessageReceiveDataTypes = {
  [MessageType.MAP]: MapData;
  [MessageType.ADD_ENTITY]: string;
  [MessageType.ADD_ACTION]: string;
  [MessageType.UPDATE_ENTITY]: Entity;
  [MessageType.UPDATE_ACTION]: Action;
  [MessageType.REMOVE_ENTITY]: string;
  [MessageType.REMOVE_ACTION]: string;
};

export type GameThreadMessageReceiveDataTypes = {
  [MessageType.INITIALIZE]: Camera;
  [MessageType.QUERY]: Camera;
  [MessageType.ANIMATE]: {
    runes: [Rune, number][];
    incantation: string;
  };
  [MessageType.REFRESH_ENTITY]: string;
  [MessageType.REFRESH_ACTION]: string;
};

export type MainThreadChannel = {
  onmessage:
    | (<T extends keyof MainThreadMessageReceiveDataTypes>(
        this: BroadcastChannel,
        ev: MessageEvent<Message<T, MainThreadMessageReceiveDataTypes[T]>>
      ) => void)
    | null;
  postMessage: <T extends keyof GameThreadMessageReceiveDataTypes>(
    message: Message<T, GameThreadMessageReceiveDataTypes[T]>
  ) => void;
};

export type GameThreadChannel = {
  onmessage:
    | (<T extends keyof GameThreadMessageReceiveDataTypes>(
        this: BroadcastChannel,
        ev: MessageEvent<Message<T, GameThreadMessageReceiveDataTypes[T]>>
      ) => void)
    | null;
  postMessage: <T extends keyof MainThreadMessageReceiveDataTypes>(
    message: Message<T, MainThreadMessageReceiveDataTypes[T]>
  ) => void;
};

export type MainThreadHandler = {
  [Type in keyof MainThreadMessageReceiveDataTypes]?: (
    msg: MainThreadMessageReceiveDataTypes[Type]
  ) => void;
};

export type GameThreadHandler = {
  [Type in keyof GameThreadMessageReceiveDataTypes]?: (
    msg: GameThreadMessageReceiveDataTypes[Type]
  ) => void;
};
