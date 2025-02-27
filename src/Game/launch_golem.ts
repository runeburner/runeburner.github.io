import {
  ActionType,
  AttuneAction,
  MineAction,
  MoveAction,
} from "../types/actions";
import { EntityType, GolemEntity, HeartEntity } from "../types/entity";
import { UIMessageType } from "../types/uiMessages";
import { Tile } from "../types/tile";
import { channel } from "./channel";
import { waitingActionMap } from "./values";
import workerScriptHeader from "./workerScriptHeader.js?raw";
import {
  EntityRequest,
  EntityMessageHandler,
  EntityMessageReceiveDataTypes,
  EntityWorker,
} from "../types/entityMessages";
import { game } from "./game";
import { dist, Vec } from "../types/vec";
import { camera } from "./camera";
import { aStarPath } from "./path";
import { ID } from "./id";

const isVec = (v: unknown): v is Vec =>
  Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]);
const isString = (v: unknown): v is string => typeof v === typeof "";
const isNumber = (v: unknown): v is string => typeof v === typeof 0;

const isArgs = (
  args: unknown[],
  ...vals: ((v: unknown) => boolean)[]
): boolean =>
  args.length === vals.length && args.every((arg, i) => vals[i](arg));

const wwHandlerMap: EntityMessageHandler = {
  WORKER_READY: (id) =>
    navigator.locks.request(String(id), () => {
      const i = game.entities.findIndex((e) => e.id === id);
      if (i === -1) return;
      const entity = game.entities[i];
      game.entities.splice(i, 1);
      if (camera.isInView(entity.pos)) {
        channel.postMessage({
          type: UIMessageType.REMOVE_ENTITY,
          data: id,
        });
      }
    }),
  findClosestTile: (id, worker, m) => {
    if (!isArgs(m.args, isString, isNumber)) {
      worker.postMessage({
        requestID: m.requestID,
        data: null,
      });
      return;
    }
    const [tileType, radius] = m.args;
    const golem = game.entities.find((e) => e.id === id)!;

    worker.postMessage({
      requestID: m.requestID,
      data: game.findClosest(
        golem.pos,
        Object.entries(Tile).find((t) => t[0] === tileType)![1],
        radius
      ),
    });
  },
  goNextTo: (id, worker, m) => {
    if (!isArgs(m.args, isVec)) {
      worker.postMessage({
        requestID: m.requestID,
        data: null,
      });
      return;
    }
    const golem = game.entities.find((e) => e.id === id)!;
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
      id: ID.next(),
      entityID: golem.id,
      goal: [...m.args[0]],
      path: path,
      pos: [...path[0]],
      progress: [0, (golem as GolemEntity).weight],
    } satisfies MoveAction;
    game.actions.push(action);
    waitingActionMap[action.id] = (v: unknown) => {
      worker.postMessage({
        requestID: m.requestID,
        data: v,
      });
    };
    if (camera.isInView(action.pos)) {
      channel.postMessage({
        type: UIMessageType.ADD_ACTION,
        data: action.id,
      });
    }
  },
  mine: (id, worker, m) => {
    if (!isArgs(m.args, isVec)) {
      worker.postMessage({
        requestID: m.requestID,
        data: null,
      });
      return;
    }
    const golem = game.entities.find((e) => e.id === id)!;
    const tile = m.args[0];
    if (dist(golem.pos, tile) > Math.SQRT2) {
      worker.postMessage({
        requestID: m.requestID,
        data: null,
      });
      return;
    }
    const action = {
      type: ActionType.MINE,
      progress: [0, 16],
      tile: tile,
      entityID: golem.id,
      id: ID.next(),
      pos: [...golem.pos],
    } satisfies MineAction;
    game.actions.push(action);
    waitingActionMap[action.id] = (v: unknown) => {
      worker.postMessage({
        requestID: m.requestID,
        data: v,
      });
    };
    if (camera.isInView(action.pos)) {
      channel.postMessage({
        type: UIMessageType.ADD_ACTION,
        data: action.id,
      });
    }
  },
  attune: (id, worker, m) => {
    const golem = game.entities.find((e) => e.id === id)! as GolemEntity;
    const heart = game.entities.find(
      (e) => e.type === EntityType.HEART
    )! as HeartEntity;

    if (dist(golem.pos, heart.pos) > Math.SQRT2) {
      worker.postMessage({
        requestID: m.requestID,
      });
      return;
    }

    const action = {
      type: ActionType.ATTUNE,
      id: ID.next(),
      pos: [...golem.pos],
      entityID: golem.id,
      heartPos: [...heart.pos],
      progress: [0, 16],
    } satisfies AttuneAction;
    game.actions.push(action);
    waitingActionMap[action.id] = () => {
      worker.postMessage({
        requestID: m.requestID,
      });
    };
    if (camera.isInView(action.pos)) {
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

export const launchGolem = (id: number, incantation: string) => {
  const o = URL.createObjectURL(
    new Blob([workerScriptHeader + incantation], {
      type: "application/javascript",
    })
  );
  const worker: EntityWorker = new Worker(new URL(o, import.meta.url), {
    name: String(id),
  });
  worker.onmessage = <T extends keyof EntityMessageReceiveDataTypes>(
    m: MessageEvent<EntityRequest<T>>
  ) => wwHandlerMap[m.data.command]?.(id, worker, m.data);
};
