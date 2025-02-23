import { Action } from "../types/actions";
import { Entity } from "../types/entity";
import { MapData, MessageType, UIChannel, UIMessage } from "../types/message";

export const Channel = (() => {
  const actionSubs: Record<string, (a: Action) => void> = {};
  const entitySubs: Record<string, (e: Entity) => void> = {};
  let mapDataSub: ((data: MapData) => void) | null = null;
  let addEntitySub: ((data: string) => void) | null = null;
  let addActionSub: ((data: string) => void) | null = null;

  const c: UIChannel = new BroadcastChannel("UI");
  c.onmessage = ({ data: msg }) => {
    switch (msg.type) {
      case MessageType.MAP: {
        if (mapDataSub) mapDataSub(msg.data);
        break;
      }
      case MessageType.ADD_ENTITY: {
        if (addEntitySub) addEntitySub(msg.data);
        break;
      }
      case MessageType.ADD_ACTION: {
        if (addActionSub) addActionSub(msg.data);
        break;
      }
      case MessageType.UPDATE_ENTITY: {
        const f = entitySubs[msg.data.id];
        if (f) f(msg.data);
        break;
      }
      case MessageType.UPDATE_ACTION: {
        const f = actionSubs[msg.data.id];
        if (f) f(msg.data);
        break;
      }
    }
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
      f0: (data: MapData) => void,
      f1: (data: string) => void,
      f2: (data: string) => void
    ): (() => void) => {
      mapDataSub = f0;
      addEntitySub = f1;
      addActionSub = f2;
      return () => {
        mapDataSub = null;
        addEntitySub = null;
        addActionSub = null;
      };
    },
    send: (msg: UIMessage) => {
      c.postMessage(msg);
    },
  };
})();
