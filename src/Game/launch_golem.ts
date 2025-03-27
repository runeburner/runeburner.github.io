import { game } from "./game";
import workerHeader from "./workerScriptHeader.js?raw";
import { Action, ActionType } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { rs } from "./RS";
import { Tile } from "../types/tile";

// Declare a type to encompass a proxy call to any of the function
type ProxyRS = {
  [K in keyof typeof rs]: (
    e: Entity,
    ...args: unknown[]
  ) => ReturnType<(typeof rs)[K]>;
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

window.Tile = Tile;
window.EntityType = EntityType;

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

    const typed = rs as ProxyRS;
    const proxy = new Proxy(typed, {
      get(_, prop: keyof typeof typed) {
        return (...args: unknown[]): ReturnType<(typeof rs)[typeof prop]> =>
          typed[prop](entity, ...args);
      },
    });
    game.workers.push({
      id: entity.id,
      tick: m.tick,
      objectURL: o,
      proxy: proxy,
      lastAction: { __type: ActionType.IDLE, id: entity.id },
    });
    return true;
  });
};
