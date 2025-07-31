import { eq } from "../types/vec";

let inspectedTile: Vec = [0, 0];
let listeners: (() => void)[] = [];

export const TileStore = {
  setTile(v: Vec): void {
    if (eq(inspectedTile, v)) return;
    inspectedTile = v;

    for (const listener of listeners) {
      listener();
    }
  },
  subscribe(listener: () => void) {
    listeners.push(listener);
    return (): void => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot(): Vec {
    return inspectedTile;
  },
};
