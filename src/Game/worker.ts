import { Entity } from "./Entity";
import "./channel";

export const defaultMap: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
  [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
  [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3],
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
];

// export const defaultMap: number[][] = [
//   [1, 2, 3, 4, 5, 6],
//   [7, 8, 9, 0, 1, 2],
//   [3, 4, 5, 6, 7, 8],
//   [9, 0, 1, 2, 3, 4],
//   [5, 6, 7, 8, 9, 0],
//   [1, 2, 3, 4, 5, 6],
// ];
// export const defaultMap: number[][] = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 1, 2, 3],
// ];

// First int is the tile id, second is the metadata
export const ValuesPerTile = 2;

export type Map = {
  width: number;
  height: number;
  data: Int32Array;
};

export const map: Map = (() => {
  const height = defaultMap.length;
  const width = defaultMap[0].length;
  const data = new Int32Array(width * height * ValuesPerTile);
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      data[(j * width + i) * ValuesPerTile] = defaultMap[j][i];
    }
  }
  return {
    width,
    height,
    data,
  };
})();

export const entities: Entity[] = [];

const sleep = (n: number) => new Promise((res) => setTimeout(res, n));

(async () => {
  while (true) {
    await sleep(1000);
  }
})();
