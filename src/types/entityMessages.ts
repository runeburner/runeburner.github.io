import { Vec } from "./vec";

export const EntityCallType = Object.freeze({
  WORKER_READY: "WORKER_READY",
  findClosestTile: "findClosestTile",
  goNextTo: "goNextTo",
  mine: "mine",
  ping: "ping",
} as const);

export type EntityCallType =
  (typeof EntityCallType)[keyof typeof EntityCallType];

export type EntityMessageReceiveDataTypes = {
  [EntityCallType.WORKER_READY]: void;
  [EntityCallType.findClosestTile]: [string, number];
  [EntityCallType.goNextTo]: [Vec];
  [EntityCallType.mine]: [Vec];
  [EntityCallType.ping]: void;
};

export type EntityMessage<T extends EntityCallType> = {
  workerID: string;
  requestID: string;
  command: T;
  args: EntityMessageReceiveDataTypes[T];
};

export type EntityMessageHandler = {
  [Type in keyof EntityMessageReceiveDataTypes]: (
    id: string,
    w: EntityWorker,
    msg: EntityMessage<Type>
  ) => void;
};

export type EntityWorker = {
  onmessage:
    | (<T extends keyof EntityMessageReceiveDataTypes>(
        this: Worker,
        ev: MessageEvent<EntityMessage<T>>
      ) => void)
    | null;
} & Worker;
