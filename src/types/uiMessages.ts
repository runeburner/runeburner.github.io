import { Action } from "./actions";
import { Entity } from "./entity";
import { Rune } from "./rune";
import { Vec } from "./vec";

export const UIMessageType = Object.freeze({
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

export type UIMessageType = (typeof UIMessageType)[keyof typeof UIMessageType];

export type Camera = {
  pos: Vec;
  size: Vec;
};

export type UIMessage<K extends UIMessageType, V> = {
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

type MainThreadUIMessageReceiveDataTypes = {
  [UIMessageType.MAP]: MapData;
  [UIMessageType.ADD_ENTITY]: string;
  [UIMessageType.ADD_ACTION]: string;
  [UIMessageType.UPDATE_ENTITY]: Entity;
  [UIMessageType.UPDATE_ACTION]: Action;
  [UIMessageType.REMOVE_ENTITY]: string;
  [UIMessageType.REMOVE_ACTION]: string;
};

type GameThreadUIMessageReceiveDataTypes = {
  [UIMessageType.INITIALIZE]: Camera;
  [UIMessageType.QUERY]: Camera;
  [UIMessageType.ANIMATE]: {
    runes: [Rune, number][];
    incantation: string;
  };
  [UIMessageType.REFRESH_ENTITY]: string;
  [UIMessageType.REFRESH_ACTION]: string;
};

export type MainThreadUIChannel = {
  onmessage:
    | (<T extends keyof MainThreadUIMessageReceiveDataTypes>(
        this: BroadcastChannel,
        ev: MessageEvent<UIMessage<T, MainThreadUIMessageReceiveDataTypes[T]>>
      ) => void)
    | null;
  postMessage: <T extends keyof GameThreadUIMessageReceiveDataTypes>(
    message: UIMessage<T, GameThreadUIMessageReceiveDataTypes[T]>
  ) => void;
};

export type GameThreadUIChannel = {
  onmessage:
    | (<T extends keyof GameThreadUIMessageReceiveDataTypes>(
        this: BroadcastChannel,
        ev: MessageEvent<UIMessage<T, GameThreadUIMessageReceiveDataTypes[T]>>
      ) => void)
    | null;
  postMessage: <T extends keyof MainThreadUIMessageReceiveDataTypes>(
    message: UIMessage<T, MainThreadUIMessageReceiveDataTypes[T]>
  ) => void;
};

export type MainThreadUIHandler = {
  [Type in keyof MainThreadUIMessageReceiveDataTypes]: (
    msg: MainThreadUIMessageReceiveDataTypes[Type]
  ) => void;
};

export type GameThreadUIHandler = {
  [Type in keyof GameThreadUIMessageReceiveDataTypes]: (
    msg: GameThreadUIMessageReceiveDataTypes[Type]
  ) => void;
};
