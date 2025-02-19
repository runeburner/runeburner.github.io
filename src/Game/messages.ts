export const MessageTypes = Object.freeze({
  SUBSCRIBE: "SUBSCRIBE",
  MAP: "MAP",
} as const);

type MessageType = (typeof MessageTypes)[keyof typeof MessageTypes];

export interface GenericMessage<T> {
  type: MessageType;
  data?: T;
}

interface SubscribeMessage {
  type: "SUBSCRIBE";
  data: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface MapDataMessage {
  type: "MAP";
  data: {
    tiles: number[][];
    x: number;
    y: number;
  };
}

export type UIMessage = SubscribeMessage | MapDataMessage;
