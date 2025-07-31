import { game } from "./game";
import { Action, ActionType } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { rs } from "./RS";
import { Tile } from "../types/tile";
import { esbuildIsInit, transpile } from "./esbuild";

export type EntityTicker = {
  id: number;
  tick: (rs: RS) => Action;
  objectURL: string;
  proxy: ProxyObject<RS>;
  lastAction: Action;
};

type Module = {
  tick?: (rs: RS) => Action;
};

window.Tile = Tile;
window.EntityType = EntityType;

const memory: RSMemory = {};

type ProxyObject<T extends object> = {
  [key in keyof T]: key extends "memory"
    ? RSMemory
    : T[key] extends object
    ? ProxyObject<T[key]>
    : T[key] extends (...args: never) => unknown
    ? (entity: Entity, ...args: Parameters<T[key]>) => ReturnType<T[key]>
    : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxied = <T extends object>(obj: T, entity: Entity): any => {
  return {
    get(_: unknown, prop: keyof typeof obj) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (...args: unknown[]): any => (obj[prop] as any)(entity, ...args);
    },
  };
};

const proxyRS = (entity: Entity): ProxyObject<RS> => {
  return {
    memory: memory,
    world: new Proxy(rs.world, proxied(rs.world, entity)),
    act: new Proxy(rs.act, proxied(rs.act, entity)),
    me: new Proxy(rs.me, proxied(rs.me, entity)),
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
    if (!m.tick || typeof m.tick !== "function") {
      URL.revokeObjectURL(o);
      return false;
    }

    game.workers.push({
      id: entity.id,
      tick: m.tick,
      objectURL: o,
      proxy: proxyRS(entity),
      lastAction: { __type: ActionType.IDLE, id: entity.id },
    });
    return true;
  });
};
