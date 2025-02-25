import { Action } from "../types/actions";
import { Entity } from "../types/entity";
import {
  MapData,
  MessageHandlers,
  MessageType,
  UIChannel,
  UIMessage,
} from "../types/message";

export const Channel = (() => {
  const actionSubs: Record<string, (a: Action) => void> = {};
  const entitySubs: Record<string, (e: Entity) => void> = {};
  let mapDataSub: ((data: MapData) => void) | null = null;
  let addEntitySub: ((data: string) => void) | null = null;
  let addActionSub: ((data: string) => void) | null = null;
  let removeEntitySub: ((data: string) => void) | null = null;
  let removeActionSub: ((data: string) => void) | null = null;

  const c: UIChannel = new BroadcastChannel("UI");

  const handlers: MessageHandlers = {
    [MessageType.MAP]: (msg) => {
      if (mapDataSub) mapDataSub(msg.data);
    },
    [MessageType.ADD_ENTITY]: (msg) => {
      if (addEntitySub) addEntitySub(msg.data);
    },
    [MessageType.ADD_ACTION]: (msg) => {
      if (addActionSub) addActionSub(msg.data);
    },
    [MessageType.REMOVE_ENTITY]: (msg) => {
      if (removeEntitySub) removeEntitySub(msg.data);
    },
    [MessageType.REMOVE_ACTION]: (msg) => {
      if (removeActionSub) removeActionSub(msg.data);
    },
    [MessageType.UPDATE_ENTITY]: (msg) => {
      const f = entitySubs[msg.data.id];
      if (f) f(msg.data);
    },
    [MessageType.UPDATE_ACTION]: (msg) => {
      const f = actionSubs[msg.data.id];
      if (f) f(msg.data);
    },
  };
  c.onmessage = ({ data: msg }) => {
    const f = handlers[msg.type];
    if (!f) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    f(msg as any);
  };

  return {
    subAction: (id: string, f: (a: Action) => void): (() => void) => {
      actionSubs[id] = f;
      return () => {
        delete actionSubs[id];
      };
    },
    subEntity: (id: string, f: (a: Entity) => void): (() => void) => {
      entitySubs[id] = f;
      return () => {
        delete entitySubs[id];
      };
    },
    subMap: (
      mapDataSub0: (data: MapData) => void,
      addEntitySub0: (data: string) => void,
      addActionSub0: (data: string) => void,
      removeEntitySub0: (data: string) => void,
      removeActionSub0: (data: string) => void
    ): (() => void) => {
      mapDataSub = mapDataSub0;
      addEntitySub = addEntitySub0;
      addActionSub = addActionSub0;
      removeEntitySub = removeEntitySub0;
      removeActionSub = removeActionSub0;
      return () => {
        mapDataSub = null;
        addEntitySub = null;
        addActionSub = null;
        removeEntitySub = null;
        removeActionSub = null;
      };
    },
    send: (msg: UIMessage) => {
      c.postMessage(msg);
    },
  };
})();
