import { game } from "./game";
import { Action, ActionType } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { rs } from "./RS";
import { Tile } from "../types/tile";

export type EntityTicker = {
  id: number;
  tick: (rb: unknown) => Action;
  objectURL: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proxy: any;
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
  const o = URL.createObjectURL(
    new Blob([incantation], {
      type: "application/javascript",
    })
  );

  const p: Promise<Module> = import(/* @vite-ignore */ o);
  return p.then((m) => {
    if (!m.tick) {
      URL.revokeObjectURL(o);
      return false;
    }

    const proxy = {
      game: new Proxy(rs.game, {
        get(_, prop: keyof typeof rs.game) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (...args: unknown[]): any =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (rs.game[prop] as any)(entity, ...args);
        },
      }),
      act: new Proxy(rs.act, {
        get(_, prop: keyof typeof rs.act) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (...args: unknown[]): any =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (rs.act[prop] as any)(entity, ...args);
        },
      }),
      me: new Proxy(rs.me, {
        get(_, prop: keyof typeof rs.me) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (...args: unknown[]): any =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (rs.me[prop] as any)(entity, ...args);
        },
      }),
    };
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
