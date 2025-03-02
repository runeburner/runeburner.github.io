import { game } from "./game";
import workerHeader from "./workerScriptHeader.js?raw";
import { Action } from "../types/actions";

export type EntityTicker = {
  id: number;
  tick: (rb: unknown) => Action;
  objectURL: string;
};

type Module = {
  tick?: (rb: unknown) => Action;
};

export const launchGolem = async (
  id: number,
  incantation: string
): Promise<boolean> => {
  const idScript = `const ENTITY_ID = ${id};\n`;

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
    game.workers.push({
      id: id,
      tick: m.tick,
      objectURL: o,
    });
    return true;
  });
};
