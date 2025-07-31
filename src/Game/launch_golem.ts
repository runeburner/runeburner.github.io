import { game } from "./game";
import { Action, ActionType } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { rs } from "./RS";
import { Tile } from "../types/tile";
import { esbuildIsInit, transpile } from "./esbuild";

export type EntityTicker = {
  id: number;
  tick: () => Action;
  objectURL: string;
  lastAction: Action;
};

type Module = {
  tick?: (rs: RS) => Action;
};

window.Tile = Tile;
window.EntityType = EntityType;

const memory: RSMemory = {};

export type InternalRS = {
  [key in keyof RS]: key extends "memory"
    ? RSMemory
    : InternalRSNamespace<RS[key]>;
};

type InternalRSNamespace<T extends object> = {
  [key in keyof T]: T[key] extends object
    ? InternalRSNamespace<T[key]>
    : T[key] extends (...args: never) => unknown
    ? (entity: Entity, ...args: Parameters<T[key]>) => ReturnType<T[key]>
    : never;
};

const proxyHandler = <T extends object>(
  obj: InternalRSNamespace<T>,
  entity: Entity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  return {
    get(_: unknown, prop: keyof typeof obj) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: unknown[]): any => (obj[prop] as any)(entity, ...args);
    },
  };
};

const createProxy = <T extends object>(
  t: InternalRSNamespace<T>,
  entity: Entity
): T => {
  const handler = proxyHandler(t, entity);
  const p = new Proxy(t, handler);
  return p as T;
};

const proxyRS = (entity: Entity): RS => {
  return {
    memory: memory,
    world: createProxy(rs.world, entity),
    act: createProxy(rs.act, entity),
    me: createProxy(rs.me, entity),
  };
};

export const launchGolem = async (
  entity: Entity,
  incantation: string
): Promise<boolean> => {
  await esbuildIsInit;

  const ret = await transpile(incantation);

  const o = URL.createObjectURL(
    new Blob([ret.code], {
      type: "application/javascript",
    })
  );

  const p: Promise<Module> = import(/* @vite-ignore */ o);
  return p.then((m) => {
    const tick = m.tick;
    if (!tick || typeof tick !== "function") {
      URL.revokeObjectURL(o);
      return false;
    }

    game.workers.push({
      id: entity.id,
      tick: () => tick(proxyRS(entity)),
      objectURL: o,
      lastAction: { __type: ActionType.IDLE, id: entity.id },
    });
    return true;
  });
};
