import { Action } from "../types/actions";
import { Entity } from "../types/entity";
import {
  MapData,
  UIMessageType,
  MainThreadUIChannel,
  MainThreadUIHandler,
} from "../types/uiMessages";

export const Channel = (() => {
  const actionSubs: Record<string, (a: Action) => void> = {};
  const entitySubs: Record<string, (e: Entity) => void> = {};
  let mapDataSub: ((data: MapData) => void) | null = null;
  let addEntitySub: ((data: string) => void) | null = null;
  let addActionSub: ((data: string) => void) | null = null;
  let removeEntitySub: ((data: string) => void) | null = null;
  let removeActionSub: ((data: string) => void) | null = null;

  const c: MainThreadUIChannel = new BroadcastChannel("UI");

  const handlers: MainThreadUIHandler = {
    [UIMessageType.MAP]: (data) => {
      if (mapDataSub) mapDataSub(data);
    },
    [UIMessageType.ADD_ENTITY]: (entityID) => {
      if (addEntitySub) addEntitySub(entityID);
    },
    [UIMessageType.ADD_ACTION]: (actionID) => {
      if (addActionSub) addActionSub(actionID);
    },
    [UIMessageType.REMOVE_ENTITY]: (entityID) => {
      if (removeEntitySub) removeEntitySub(entityID);
    },
    [UIMessageType.REMOVE_ACTION]: (actionID) => {
      if (removeActionSub) removeActionSub(actionID);
    },
    [UIMessageType.UPDATE_ENTITY]: (entity) => {
      entitySubs[entity.id]?.(entity);
    },
    [UIMessageType.UPDATE_ACTION]: (action) => {
      actionSubs[action.id]?.(action);
    },
  };

  c.onmessage = ({ data: msg }) => handlers[msg.type]?.(msg.data);

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
    send: (msg: Parameters<MainThreadUIChannel["postMessage"]>[0]) => {
      c.postMessage(msg);
    },
  };
})();
