import { Action } from "../types/actions";
import { ValuesPerTile } from "../types/map";
import { Tile } from "../types/tile";
import { Vec } from "../types/vec";
import { defaultEntities, defaultMap } from "./defaultValues";

export const game = (() => {
  return {
    entities: defaultEntities,
    actions: [] as Action[],
    map: (() => {
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
    })(),
    at(v: Vec): Int32Array {
      const start = (v[1] * this.map.width + v[0]) * ValuesPerTile;
      return this.map.data.slice(start, start + ValuesPerTile);
    },
    findClosest(pos: Vec, wantTile: Tile, radius: number): Vec {
      const x = Math.max(0, pos[0] - Math.floor(radius / 2));
      const X = Math.min(this.map.width, pos[0] + Math.ceil(radius / 2));
      const y = Math.max(0, pos[1] - Math.floor(radius / 2));
      const Y = Math.min(this.map.height, pos[1] + Math.ceil(radius / 2));
      let closestTile: Vec = [-1, -1];
      let closestDist = 1e99;
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v = [i, j] satisfies Vec;
          const tile = this.at(v);
          if (tile[0] === wantTile) {
            const dist = Math.abs(pos[0] - i) + Math.abs(pos[1] - j);
            if (dist < closestDist) {
              closestTile = v;
              closestDist = dist;
            }
          }
        }
      }
      return closestTile;
    },
  };
})();
