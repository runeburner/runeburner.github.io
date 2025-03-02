import { ACTProgress } from "./ACT";
import { Entity } from "./entity";
import { Resources } from "./resources";
import { Rune } from "./rune";
import { Vec } from "./vec";

export const UIMessageType = Object.freeze({
  INITIALIZE: "INITIALIZE",
  QUERY: "QUERY",
  MAP: "MAP",
  ANIMATE: "ANIMATE",
  ADD_ENTITY: "ADD_ENTITY",
  UPDATE_ENTITY: "UPDATE_ENTITY",
  REFRESH_ENTITY: "REFRESH_ENTITY",
  REMOVE_ENTITY: "REMOVE_ENTITY",
  RESOURCES: "RESOURCES",
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
  entityIDs: number[];
  camera?: Camera;
};

export type UIEntity = {
  entity: Entity;
  action?: ACTProgress;
};

type MainThreadUIMessageReceiveDataTypes = {
  [UIMessageType.MAP]: MapData;
  [UIMessageType.ADD_ENTITY]: number;
  [UIMessageType.UPDATE_ENTITY]: UIEntity;
  [UIMessageType.REMOVE_ENTITY]: number;
  [UIMessageType.RESOURCES]: Resources;
};

type GameThreadUIMessageReceiveDataTypes = {
  [UIMessageType.INITIALIZE]: Camera;
  [UIMessageType.QUERY]: Camera;
  [UIMessageType.ANIMATE]: {
    runes: [Rune, number][];
    incantation: string;
  };
  [UIMessageType.REFRESH_ENTITY]: number;
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
