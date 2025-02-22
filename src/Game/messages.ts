export const MessageTypes = Object.freeze({
  SUBSCRIBE: "SUBSCRIBE",
  MAP: "MAP",
} as const);

type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

export type GenericMessage<T> = {
  type: MessageType;
  data?: T;
};

type SubscribeMessage = {
  type: "SUBSCRIBE";
  data: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type MapDataMessage = {
  type: "MAP";
  data: {
    tiles: Int32Array;
    x: number;
    y: number;
  };
};

export type UIMessage = SubscribeMessage | MapDataMessage;
