import {
  ACT,
  ACTProgress,
  ACTType,
  ATTUNE,
  ATTUNEProgress,
  MINE,
  MINEProgress,
  MOVE,
  MOVEProgress,
} from "../types/ACT";
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
  [T in ACTType]: (e: Entity, p: ACTProgress) => boolean;
} = {
  [ACTType.MOVE]: (e: Entity, p: ACTProgress): boolean => {
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
  [ACTType.MINE]: (e: Entity, p: ACTProgress): boolean => {
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
  [ACTType.ATTUNE]: (e: Entity, p: ACTProgress): boolean => {
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

const rb = {
  findNearest(e: Entity, tile: keyof typeof Tile, radius: number): Vec | null {
    return game.findClosestTile(e.pos, Tile[tile], radius);
  },
  me(e: Entity): Entity {
    return e;
  },
  isInRange(e: Entity, v: Vec): boolean {
    return dist(e.pos, v) <= 1;
  },
  findClosestEntity(e: Entity, entityType: EntityType): Vec | null {
    return game.findClosestEntity(e.pos, entityType);
  },
};

setInterval((): void => {
  const actions: ACT[] = new Array(game.workers.length);
  for (let i = 0; i < game.workers.length; i++) {
    const e = JSON.parse(
      JSON.stringify(
        Object.values(game.entityM).find((e) => e.id === game.workers[i].id)
      )
    );
    const rs = new Proxy(rb, {
      get(_, prop) {
        return (...args: unknown[]) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (rb as any)[prop](e, ...args);
      },
    });
    const action = game.workers[i].tick(rs);
    actions[i] = action;
  }

  for (let i = 0; i < actions.length; i++) {
    if (!actions[i]) continue;
    switch (actions[i].type) {
      case ACTType.MOVE: {
        const a = actions[i] as MOVE;
        const old = game.actionM[a.id] as MOVEProgress | undefined;
        const golem = game.entityM[a.id] as GolemEntity;
        if (dist(golem.pos, a.v) <= 1) continue;
        if (old && eq(old.goal, a.v)) continue;
        delete game.actionM[a.id];
        const path = aStarPath(golem.pos, a.v);
        if (path == null) break;
        path.pop();
        const progress = {
          type: ACTType.MOVE,
          goal: [...a.v],
          path: path,
          progress: [0, golem.weight],
        } satisfies MOVEProgress;
        game.actionM[a.id] = progress;
        break;
      }
      case ACTType.MINE: {
        const a = actions[i] as MINE;
        const old = game.actionM[a.id] as MINEProgress | undefined;
        const golem = game.entityM[a.id] as GolemEntity;
        if (dist(golem.pos, a.v) > 1) continue;
        if (golem.minecapacity[0] === golem.minecapacity[1]) continue;
        if (game.tileAt(a.v)[0] !== Tile.MANA_CRYSTAL) continue;
        if (old && eq(old.tile, a.v)) continue;
        delete game.actionM[a.id];
        const progress = {
          type: ACTType.MINE,
          pos: [...golem.pos],
          progress: [0, 16],
          tile: [...a.v],
        } satisfies MINEProgress;
        game.actionM[a.id] = progress;
        break;
      }
      case ACTType.ATTUNE: {
        const a = actions[i] as ATTUNE;
        const old = game.actionM[a.id] as ATTUNEProgress | undefined;
        const golem = game.entityM[a.id] as GolemEntity;
        if (golem.minecapacity[0] === 0) continue;
        if (old) continue;
        delete game.actionM[a.id];
        const progress = {
          type: ACTType.ATTUNE,
          progress: [0, 16],
          pos: [...golem.pos],
          heart: [
            ...Object.values(game.entityM).find(
              (e) => e.type === EntityType.HEART
            )!.pos,
          ],
        } satisfies ATTUNEProgress;
        game.actionM[a.id] = progress;
        break;
      }
    }
  }

  const visibleActions: ACTProgress[] = [];
  for (const e of Object.values(game.entityM)) {
    const p = game.actionM[e.id];
    if (!p) continue;
    const del = process[p.type](e, p);
    if (del) {
      delete game.actionM[e.id];
    }

    if (camera.isInView(e.pos)) {
      channel.postMessage({
        type: UIMessageType.UPDATE_ENTITY,
        data: e,
      });
      if (game.actionM[e.id]) {
        visibleActions.push(game.actionM[e.id]);
      }
    }
  }

  channel.postMessage({
    type: UIMessageType.ACTIONS,
    data: visibleActions,
  });
}, 100);
