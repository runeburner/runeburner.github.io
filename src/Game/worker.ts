import {
  Action,
  ActionType,
  ActionTypeMap,
  ATTUNE,
  ATTUNEProgress,
  MINE,
  MINEProgress,
  MOVE,
  MOVEProgress,
  ActionProgress,
} from "../types/actions";
import { Entity, EntityType, GolemEntity } from "../types/entity";
import { Tile } from "../types/tile";
import { UIMessageType } from "../types/uiMessages";
import { dist, eq, Vec } from "../types/vec";
import { camera } from "./camera";
import "./channel";
import { channel } from "./channel";
import { game } from "./game";
import { aStarPath } from "./path";

const process: {
  [T in ActionType]: (e: Entity, p: ActionProgress) => boolean;
} = {
  [ActionType.MOVE]: (e: Entity, p: ActionProgress): boolean => {
    const golem = e as GolemEntity;
    const mp = p as MOVEProgress;
    mp.progress[0] += golem.speed;
    while (mp.progress[0] >= mp.progress[1]) {
      if (game.entityAt(mp.path[1])) {
        const newPath = aStarPath(golem.pos, mp.goal);
        if (!newPath) return true;
        newPath.pop();
        mp.path = newPath;
      }
      mp.progress[0] -= mp.progress[1];
      mp.path.shift();
      const nextNode = mp.path[0];
      e.pos = [...nextNode];
    }
    return mp.path.length === 1;
  },
  [ActionType.MINE]: (e: Entity, p: ActionProgress): boolean => {
    const golem = e as GolemEntity;
    const action = p as MINEProgress;
    action.progress[0] += golem.mineSpeed;
    while (
      action.progress[0] >= action.progress[1] &&
      golem.minecapacity[0] < golem.minecapacity[1]
    ) {
      action.progress[0] -= action.progress[1];
      golem.minecapacity[0]++;
    }

    return golem.minecapacity[0] === golem.minecapacity[1];
  },
  [ActionType.ATTUNE]: (e: Entity, p: ActionProgress): boolean => {
    const golem = e as GolemEntity;
    const action = p as ATTUNEProgress;
    action.progress[0] += golem.mineSpeed;
    while (
      action.progress[0] >= action.progress[1] &&
      golem.minecapacity[0] > 0
    ) {
      action.progress[0] -= action.progress[1];
      golem.minecapacity[0]--;
      game.addAttunement(1);
    }

    return golem.minecapacity[0] === 0;
  },
};

const isVec = (v: unknown): v is Vec =>
  Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]);
const isString = (v: unknown): v is string => typeof v === typeof "";
const isNumber = (v: unknown): v is string => typeof v === typeof 0;

const isArgs = (
  args: unknown[],
  ...vals: ((v: unknown) => boolean)[]
): boolean =>
  args.length === vals.length && args.every((arg, i) => vals[i](arg));

const rsObject = {
  findNearest(e: Entity, tile: keyof typeof Tile, radius: number): Vec | null {
    if (!isArgs([tile, radius], isString, isNumber)) return null;
    return game.findClosestTile(e.pos, Tile[tile], radius);
  },
  me(e: Entity): Entity {
    return e;
  },
  isInRange(e: Entity, v: Vec): boolean {
    if (!isArgs([v], isVec)) return false;
    return dist(e.pos, v) <= 1;
  },
  findClosestEntity(e: Entity, entityType: EntityType): Vec | null {
    if (!isArgs([entityType], isString)) return null;
    return game.findClosestEntity(e.pos, entityType);
  },
};

const maker: {
  [T in ActionType]: (a: ActionTypeMap[T][0]) => ActionProgress | true | null;
} = {
  [ActionType.MOVE]: (a: MOVE) => {
    const golem = game.entityM[a.id] as GolemEntity;
    // If we're already there, do nothing.
    if (dist(golem.pos, a.v) <= 1) return null;

    // Calculate new path
    const path = aStarPath(golem.pos, a.v);
    if (path == null) return null;
    path.pop();
    const old = game.actionM[a.id] as ActionProgress | undefined;
    const wasMoving = old && old.type === ActionType.MOVE;
    // Create new ActionProgress
    return {
      type: ActionType.MOVE,
      goal: [...a.v],
      path: path,
      // carry over progress
      progress: wasMoving ? [old.progress[0], golem.weight] : [0, golem.weight],
    } satisfies MOVEProgress;
  },
  [ActionType.MINE]: (a: MINE) => {
    const old = game.actionM[a.id] as ActionProgress | undefined;
    const golem = game.entityM[a.id] as GolemEntity;

    // If it's too far.
    if (dist(golem.pos, a.v) > 1) return null;

    // If the golem is full.
    if (golem.minecapacity[0] === golem.minecapacity[1]) return null;

    // If we're trying to mine anything other than a mana crystal
    if (game.tileAt(a.v)[0] !== Tile.MANA_CRYSTAL) return null;

    // If we were already mining this tile.
    const wasMining = old && old.type === ActionType.MINE;
    if (wasMining && eq(old.tile, a.v)) return true;

    return {
      type: ActionType.MINE,
      pos: [...golem.pos],
      // If we swap mining tile in the middle, carry over progress
      progress: wasMining ? old.progress : [0, 16],
      tile: [...a.v],
    } satisfies MINEProgress;
  },
  [ActionType.ATTUNE]: (a: ATTUNE) => {
    const old = game.actionM[a.id] as ActionProgress | undefined;
    const golem = game.entityM[a.id] as GolemEntity;
    const heart = Object.values(game.entityM).find(
      (e) => e.type === EntityType.HEART
    )!;

    // If it's too far.
    if (dist(golem.pos, heart.pos) > 1) return null;

    // If we have no mana crystals
    if (golem.minecapacity[0] === 0) return null;

    // If we were already attuning
    if (old && old.type === ActionType.ATTUNE) return true;

    return {
      type: ActionType.ATTUNE,
      progress: [0, 16],
      pos: [...golem.pos],
      heart: [...heart.pos],
    } satisfies ATTUNEProgress;
  },
};

setInterval((): void => {
  // First, gather the action of all entities.
  const actions: Action[] = new Array(game.workers.length);
  for (let i = 0; i < game.workers.length; i++) {
    const e = JSON.parse(
      JSON.stringify(
        Object.values(game.entityM).find((e) => e.id === game.workers[i].id)
      )
    );
    const rs = new Proxy(rsObject, {
      get(_, prop) {
        return (...args: unknown[]): unknown =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (rsObject as any)[prop](e, ...args);
      },
    });
    const action = game.workers[i].tick(rs);
    actions[i] = action;
  }

  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    if (!a) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = maker[a.type](a as any);
    if (p === null) {
      delete game.actionM[a.id];
    } else if (p !== true) {
      game.actionM[a.id] = p;
    }
  }

  for (const e of Object.values(game.entityM)) {
    const p = game.actionM[e.id];
    if (p) {
      const del = process[p.type](e, p);
      if (del) {
        delete game.actionM[e.id];
      }
    }

    if (camera.isInView(e.pos)) {
      channel.postMessage({
        type: UIMessageType.UPDATE_ENTITY,
        data: { entity: e, action: game.actionM[e.id] },
      });
    }
  }
}, 100);
