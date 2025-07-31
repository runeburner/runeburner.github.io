import { rs } from "./RS";

export type InternalRSNamespace<T extends object> = {
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
  const cache: Partial<Record<keyof T, unknown>> = {};
  return {
    get(_: unknown, prop: keyof T & string): unknown {
      const m = cache[prop];
      if (m) return m;

      const targetF = obj[prop];
      if (typeof targetF !== "function") return targetF;
      const f = targetF.bind(undefined, entity);
      cache[prop] = f;
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

export const proxyRS = (entity: Entity): RS => {
  return {
    world: createProxy(rs.world, entity),
    act: createProxy(rs.act, entity),
    me: createProxy(rs.me, entity),
  };
};
