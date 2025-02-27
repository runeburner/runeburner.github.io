import { Vec } from "./vec";

export const EntityCallType = Object.freeze({
  WORKER_READY: "WORKER_READY",
  findClosestTile: "findClosestTile",
  goNextTo: "goNextTo",
  mine: "mine",
  attune: "attune",
  ping: "ping",
} as const);

export type EntityCallType =
  (typeof EntityCallType)[keyof typeof EntityCallType];

export type EntityMessageReceiveDataTypes = {
  [EntityCallType.WORKER_READY]: [void, void];
  [EntityCallType.findClosestTile]: [[string, number], Vec | null];
  [EntityCallType.goNextTo]: [[Vec], unknown];
  [EntityCallType.mine]: [[Vec], unknown];
  [EntityCallType.attune]: [void, void];
  [EntityCallType.ping]: [void, string];
};

export type EntityRequest<T extends EntityCallType> = {
  requestID: number;
  command: T;
} & (EntityMessageReceiveDataTypes[T][0] extends void
  ? object
  : {
      args: EntityMessageReceiveDataTypes[T][0];
    });

type EntityResponse<T extends EntityCallType> = {
  requestID: number;
} & (EntityMessageReceiveDataTypes[T][1] extends void
  ? object
  : {
      data: EntityMessageReceiveDataTypes[T][1];
    });

type ResponseWorker<T extends EntityCallType> = {
  postMessage: (message: EntityResponse<T>) => void;
};

export type EntityMessageHandler = {
  [Type in keyof EntityMessageReceiveDataTypes]: (
    id: number,
    w: ResponseWorker<Type>,
    msg: EntityRequest<Type>
  ) => void;
};

export type EntityWorker = {
  onmessage:
    | (<T extends keyof EntityMessageReceiveDataTypes>(
        this: Worker,
        ev: MessageEvent<EntityRequest<T>>
      ) => void)
    | null;
} & Worker;
