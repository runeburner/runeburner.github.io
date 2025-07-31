import { game } from "./game";
import { Action, ActionType } from "../types/actions";
import { Entity } from "../types/entity";
import { esbuildIsInit, transpile } from "./esbuild";
import { proxyRS } from "./proxy";

export type EntityTicker = {
  id: number;
  tick: () => Action;
  objectURL: string;
  lastAction: Action;
};

type Module = {
  tick?: (rs: RS) => Action;
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

    const proxy = proxyRS(entity);

    game.workers.push({
      id: entity.id,
      tick: () => tick(proxy),
      objectURL: o,
      lastAction: { __type: ActionType.IDLE, id: entity.id },
    });
    return true;
  });
};
