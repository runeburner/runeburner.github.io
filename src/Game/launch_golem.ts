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
): ProxyHandler<T> => {
  const memo: T = Object.create(null);
  return {
    get(_: unknown, prop: keyof T & string): unknown {
      const m = memo[prop];
      if (m) return m;

      const targetF = obj[prop];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = (targetF as any).bind(undefined, entity);
      memo[prop] = f;
      return f;
    },
  };
};

const createProxy = <T extends object>(
  t: InternalRSNamespace<T>,
  entity: Entity
): T => {
  const handler = proxyHandler(t, entity);
  const p = new Proxy<T>(Object.create(null), handler);
  return p;
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

((): void => {
  type API = {
    foo(): void;
    bar(n: number): void;
  };

  type Internal<T> = {
    [key in keyof T]: T[key] extends (...args: never) => unknown
      ? (s: string, ...args: Parameters<T[key]>) => ReturnType<T[key]>
      : never;
  };

  const iAPI: Internal<API> = {
    foo(s: string): void {
      console.log(s);
    },
    bar(s: string, n: number): void {
      console.log(s, n);
    },
  };

  const s = "soo";
  const memo: Partial<API> = {};
  const proxyHandler: ProxyHandler<API> = {
    get(_: unknown, p: keyof API & string) {
      const m = memo[p];
      if (m) return m;

      const targetF = iAPI[p];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = (targetF as any).bind(undefined, s);
      memo[p] = f;
      return f;
    },
  };
  const api = new Proxy(Object.create(null), proxyHandler);

  api.foo();
  api.foo();
  api.foo();
  api.bar(3);
  api.bar(1);
  api.bar(2);
})();
