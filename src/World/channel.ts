import { Action } from "../types/actions";
import { Entity } from "../types/entity";
import { MapData, MessageType, UIChannel, UIMessage } from "../types/message";

export const Channel = (() => {
  const actionSubs: Record<string, (a: Action) => void> = {};
  const entitySubs: Record<string, (e: Entity) => void> = {};
  let mapDataSub: ((data: MapData) => void) | null = null;
  let addEntitySub: ((data: string) => void) | null = null;
  let addActionSub: ((data: string) => void) | null = null;
  let removeEntitySub: ((data: string) => void) | null = null;
  let removeActionSub: ((data: string) => void) | null = null;

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
      case MessageType.REMOVE_ENTITY: {
        if (removeEntitySub) removeEntitySub(msg.data);
        break;
      }
      case MessageType.REMOVE_ACTION: {
        if (removeActionSub) removeActionSub(msg.data);
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
