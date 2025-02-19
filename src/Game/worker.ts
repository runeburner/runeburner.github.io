import { Entity } from "./Entity";
import "./channel";

export const map: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7],
  [8, 9, 0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 0, 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 0, 1],
  [2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7],
  [8, 9, 0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 0, 1, 2, 3],
];

export const entities: Entity[] = [];

const sleep = (n: number) => new Promise((res) => setTimeout(res, n));

(async () => {
  while (true) {
    await sleep(1000);
  }
})();
