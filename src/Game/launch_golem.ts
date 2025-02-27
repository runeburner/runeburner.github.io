import { ActionType, MineAction, MoveAction } from "../types/actions";
import { GolemEntity } from "../types/entity";
import { UIMessageType } from "../types/uiMessages";
import { Tile } from "../types/tile";
import { channel, findClosest, isInView } from "./channel";
import {
  actions,
  aStarPath,
  entities,
  vecDist,
  waitingActionMap,
} from "./values";
import workerScriptHeader from "./workerScriptHeader.js?raw";
import {
  EntityRequest,
  EntityMessageHandler,
  EntityMessageReceiveDataTypes,
  EntityWorker,
} from "../types/entityMessages";

const wwHandlerMap: EntityMessageHandler = {
  WORKER_READY: (id) => navigator.locks.request(id, () => console.log("DEATH")),
  findClosestTile: (id, worker, m) => {
    const [tileType, radius] = m.args;
    const golem = entities.find((e) => e.id === id)!;

    worker.postMessage({
      requestID: m.requestID,
      data: findClosest(
        golem.pos,
        Object.entries(Tile).find((t) => t[0] === tileType)![1],
        radius
      ),
    });
  },
  goNextTo: (id, worker, m) => {
    const golem = entities.find((e) => e.id === id)!;
    const path = aStarPath(golem.pos, m.args[0]);
    if (path == null) {
      worker.postMessage({
        requestID: m.requestID,
        data: null,
      });
      return;
    }
    path.pop();
    const action = {
      type: ActionType.GOLEM_MOVE,
      id: crypto.randomUUID(),
      entityID: golem.id,
      path: path,
      pos: [...path[0]],
      progress: [0, (golem as GolemEntity).weight],
    } satisfies MoveAction;
    actions.push(action);
    waitingActionMap[action.id] = (v: unknown) => {
      worker.postMessage({
        requestID: m.requestID,
        data: v,
      });
    };
    if (isInView(action.pos)) {
      channel.postMessage({
        type: UIMessageType.ADD_ACTION,
        data: action.id,
      });
    }
  },
  mine: (id, worker, m) => {
    const golem = entities.find((e) => e.id === id)!;
    const tile = m.args[0];
    if (vecDist(golem.pos, tile) != 1) {
      worker.postMessage({
        requestID: m.requestID,
        data: null,
      });
      return;
    }
    const action = {
      progress: [0, 16],
      tile: tile,
      entityID: golem.id,
      id: crypto.randomUUID(),
      type: ActionType.MINE,
      pos: [...golem.pos],
    } satisfies MineAction;
    actions.push(action);
    waitingActionMap[action.id] = (v: unknown) => {
      worker.postMessage({
        requestID: m.requestID,
        data: v,
      });
    };
    if (isInView(action.pos)) {
      channel.postMessage({
        type: UIMessageType.ADD_ACTION,
        data: action.id,
      });
    }
  },
  ping: (_, worker, m) => {
    worker.postMessage({
      requestID: m.requestID,
      data: "pong",
    });
  },
};

export const launchGolem = (id: string, incantation: string) => {
  const o = URL.createObjectURL(
    new Blob([workerScriptHeader + incantation], {
      type: "application/javascript",
    })
  );

  const worker: EntityWorker = new Worker(new URL(o, import.meta.url), {
    name: id,
  });
  worker.onmessage = <T extends keyof EntityMessageReceiveDataTypes>(
    m: MessageEvent<EntityRequest<T>>
  ) => wwHandlerMap[m.data.command]?.(id, worker, m.data);
  worker.onerror = console.log;
  worker.onmessageerror = console.log;
};
