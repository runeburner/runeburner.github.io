import { ActionType, MineAction, MoveAction } from "../types/actions";
import { GolemEntity } from "../types/entity";
import { MessageType } from "../types/message";
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

type WorkerMessage = {
  workerID: string;
  requestID: string;
  command: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
};

type HandlerFunc = (id: string, worker: Worker, m: WorkerMessage) => void;

const wwHandlerMap: Record<string, HandlerFunc> = {
  WORKER_READY: (id: string, worker: Worker, m: WorkerMessage) => {
    navigator.locks
      .request(id, () => {})
      .then(() => {
        console.log("DEATH");
      });
    worker.postMessage({
      workerID: m.workerID,
      requestID: m.requestID,
    });
  },
  findClosestTile: (id, worker, m) => {
    const tileType = m.args[0] as string;
    const radius = m.args[1] as number;

    const golem = entities.find((e) => e.id === id)!;

    worker.postMessage({
      workerID: m.workerID,
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
        workerID: m.workerID,
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
        workerID: m.workerID,
        requestID: m.requestID,
        data: v,
      });
    };
    if (isInView(action.pos)) {
      channel.postMessage({
        type: MessageType.ADD_ACTION,
        data: action.id,
      });
    }
  },
  mine: (id, worker, m) => {
    const golem = entities.find((e) => e.id === id)!;
    const tile = m.args[0];
    if (vecDist(golem.pos, tile) != 1) {
      worker.postMessage({
        workerID: m.workerID,
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
        workerID: m.workerID,
        requestID: m.requestID,
        data: v,
      });
    };
    if (isInView(action.pos)) {
      channel.postMessage({
        type: MessageType.ADD_ACTION,
        data: action.id,
      });
    }
  },
  ping: (_, worker, m) => {
    worker.postMessage({
      workerID: m.workerID,
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

  const worker = new Worker(new URL(o, import.meta.url), {
    name: id,
  });
  worker.onmessage = (m: MessageEvent<WorkerMessage>) => {
    const handler = wwHandlerMap[m.data.command];
    if (!handler) return;
    handler(id, worker, m.data);
  };
  worker.onerror = console.log;
  worker.onmessageerror = console.log;
};
