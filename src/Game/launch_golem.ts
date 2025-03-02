import { game } from "./game";
import { Vec } from "../types/vec";
import workerHeader from "./workerScriptHeader.js?raw";
import { Action } from "../types/actions";

export const isVec = (v: unknown): v is Vec =>
  Array.isArray(v) && isNumber(v[0]) && isNumber(v[1]);
export const isString = (v: unknown): v is string => typeof v === typeof "";
const isNumber = (v: unknown): v is string => typeof v === typeof 0;

export const isArgs = (
  args: unknown[],
  ...vals: ((v: unknown) => boolean)[]
): boolean =>
  args.length === vals.length && args.every((arg, i) => vals[i](arg));

export type Worker = {
  id: number;
  tick: (rb: unknown) => Action;
};

export const launchGolem = (id: number, incantation: string): void => {
  const idScript = `const ENTITY_ID = ${id};\n`;
  const o = URL.createObjectURL(
    new Blob([idScript + workerHeader + incantation], {
      type: "application/javascript",
    })
  );
  {
    const p = import(/* @vite-ignore */ o);
    p.then((m) => {
      game.workers.push({
        id: id,
        tick: m.tick,
      });
    });
  }
};
