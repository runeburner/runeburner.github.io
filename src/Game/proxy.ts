import { rs } from "./RS";

export type InternalAPI<T extends object> = {
  [key in keyof T]: T[key] extends object
    ? InternalAPI<T[key]>
    : T[key] extends (...args: never) => unknown
    ? (entity: Entity, ...args: Parameters<T[key]>) => ReturnType<T[key]>
    : never;
};

const createSubProxy = (
  target: NonNullable<unknown>,
  entity: Entity
): unknown => {
  switch (typeof target) {
    case "object":
      return createProxy(target, entity);
    case "function":
      return target.bind(undefined, entity);
  }
};

const proxyHandler = <T extends object>(
  obj: Record<keyof T & string, unknown>,
  entity: Entity
): ProxyHandler<T> => {
  const cache: Partial<Record<keyof T, unknown>> = {};
  return {
    get(_: unknown, prop: keyof T & string): unknown {
      const m = cache[prop];
      if (m) return m;

      const target = obj[prop];
      if (!target) return;

      const proxy = createSubProxy(target, entity);
      cache[prop] = proxy;

      return proxy;
    },
  };
};

const createProxy = <T extends InternalAPI<T>>(
  t: Record<keyof T & string, unknown>,
  entity: Entity
): T => {
  const handler = proxyHandler(t, entity);
  const p = new Proxy<T>(Object.create(null), handler);
  return p;
};

export const proxyRS = (entity: Entity): RS => {
  return createProxy(rs, entity);
};
