import { Resources } from "../types/resources";
import {
  MapData,
  UIMessageType,
  MainThreadUIChannel,
  MainThreadUIHandler,
  UIEntity,
} from "../types/uiMessages";

type C = {
  subEntity: (id: number, f: (a: UIEntity) => void) => () => void;
  subMap: (
    mapDataSub0: (data: MapData) => void,
    addEntitySub0: (data: number) => void,
    removeEntitySub0: (data: number) => void
  ) => () => void;
  subResources: (f: (data: Resources) => void) => () => void;
  send: (msg: Parameters<MainThreadUIChannel["postMessage"]>[0]) => void;
};

export const Channel = ((): C => {
  const entitySubs: Record<number, (e: UIEntity) => void> = {};
  let mapDataSub: ((data: MapData) => void) | null = null;
  let addEntitySub: ((data: number) => void) | null = null;
  let removeEntitySub: ((data: number) => void) | null = null;
  let resourcesSub: ((data: Resources) => void) | null = null;

  const c: MainThreadUIChannel = new BroadcastChannel("UI");

  const handlers: MainThreadUIHandler = {
    [UIMessageType.MAP]: (data) => {
      if (mapDataSub) mapDataSub(data);
    },
    [UIMessageType.ADD_ENTITY]: (entityID) => {
      if (addEntitySub) addEntitySub(entityID);
    },
    [UIMessageType.REMOVE_ENTITY]: (entityID) => {
      if (removeEntitySub) removeEntitySub(entityID);
    },
    [UIMessageType.UPDATE_ENTITY]: (msg) => {
      entitySubs[msg.entity.id]?.(msg);
    },
    [UIMessageType.RESOURCES]: (resources) => {
      if (resourcesSub) resourcesSub(resources);
    },
    [UIMessageType.UPDATE_ENTITIES]: (entities) => {
      for (const e of entities) {
        entitySubs[e.entity.id]?.(e);
      }
    },
  };

  c.onmessage = ({ data: msg }): void => {
    handlers[msg.__type]?.(msg.data);
  };

  return {
    subEntity: (id: number, f: (a: UIEntity) => void): (() => void) => {
      entitySubs[id] = f;
      return () => {
        delete entitySubs[id];
      };
    },
    subMap: (
      mapDataSub0: (data: MapData) => void,
      addEntitySub0: (data: number) => void,
      removeEntitySub0: (data: number) => void
    ): (() => void) => {
      mapDataSub = mapDataSub0;
      addEntitySub = addEntitySub0;
      removeEntitySub = removeEntitySub0;
      return () => {
        mapDataSub = null;
        addEntitySub = null;
        removeEntitySub = null;
        c.postMessage({
          __type: UIMessageType.DEINITIALIZE,
          data: undefined,
        });
      };
    },
    subResources: (f: (data: Resources) => void): (() => void) => {
      resourcesSub = f;
      return () => (resourcesSub = null);
    },
    send: (msg: Parameters<MainThreadUIChannel["postMessage"]>[0]): void => {
      c.postMessage(msg);
    },
  };
})();
