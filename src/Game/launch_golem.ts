import { game } from "./game";
import workerHeader from "./workerScriptHeader.js?raw";
import { Action, ActionType } from "../types/actions";
import { Entity } from "../types/entity";
import { RS } from "./RS";
// Declare a type to encompass a proxy call to any of the function
type ProxyRS = {
  [K in keyof typeof RS]: (
    e: Entity,
    ...args: unknown[]
  ) => ReturnType<(typeof RS)[K]>;
};

export type EntityTicker = {
  id: number;
  tick: (rb: unknown) => Action;
  objectURL: string;
  proxy: ProxyRS;
  lastAction: Action;
};

type Module = {
  tick?: (rb: unknown) => Action;
};

export const launchGolem = async (
  entity: Entity,
  incantation: string
): Promise<boolean> => {
  const idScript = `const ENTITY_ID = ${entity.id};\n`;

  const o = URL.createObjectURL(
    new Blob([idScript + workerHeader + incantation], {
      type: "application/javascript",
    })
  );

  const p: Promise<Module> = import(/* @vite-ignore */ o);
  return p.then((m) => {
    if (!m.tick) {
      URL.revokeObjectURL(o);
      return false;
    }

    const typed = RS as ProxyRS;
    const rs = new Proxy(typed, {
      get(_, prop: keyof typeof typed) {
        return (...args: unknown[]): ReturnType<(typeof RS)[typeof prop]> =>
          typed[prop](entity, ...args);
      },
    });
    game.workers.push({
      id: entity.id,
      tick: m.tick,
      objectURL: o,
      proxy: rs,
      lastAction: { __type: ActionType.IDLE, id: entity.id },
    });
    return true;
  });
};
