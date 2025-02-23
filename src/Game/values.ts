import { Action } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { Map as GameMap, ValuesPerTile } from "../types/map";
import { Camera } from "../types/message";
import { AStarDist } from "../types/tile";

export const defaultMap: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const map: GameMap = (() => {
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

export const waitingActionMap: Record<string, (v: unknown) => void> = {};

export const actions: Action[] = [];

export const entities: Entity[] = [
  {
    type: EntityType.HEART,
    id: crypto.randomUUID(),
    x: 2,
    y: 2,
  },
];
export const determineInitialCameraPosition = (cam: Camera): Camera => {
  const core = entities.find((e) => e.type === EntityType.HEART);
  return {
    x: (core?.x ?? 0) - Math.floor(cam.width / 2),
    y: (core?.y ?? 0) - Math.floor(cam.height / 2),
    width: cam.width,
    height: cam.height,
  };
};

export const at = (x: number, y: number): Int32Array => {
  const start = (y * map.width + x) * ValuesPerTile;
  return map.data.slice(start, start + ValuesPerTile);
};

const aStarMaxWidth = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER));

const vecToSingle = (point: [number, number]): number =>
  point[0] * aStarMaxWidth + point[1];

const singleToVec = (single: number): [number, number] => [
  Math.floor(single / aStarMaxWidth),
  single % aStarMaxWidth,
];

const reconstruct_path = (
  cameFrom: Map<number, number>,
  current: number
): [number, number][] => {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }

  return path.map((p) => singleToVec(p));
};

const vecDist = (v0: [number, number], v1: [number, number]): number =>
  Math.abs(v0[0] - v1[0]) + Math.abs(v0[1] - v1[1]);

export const aStarPath = (
  start: [number, number],
  goal: [number, number]
): [number, number][] | null => {
  const singleStart = vecToSingle(start);
  const singleGoal = vecToSingle(goal);
  const openSet = [vecToSingle(start)];
  const cameFrom = new Map<number, number>();
  const gScore = new Map<number, number>();
  gScore.set(singleStart, 0);
  const fScore = new Map<number, number>();
  fScore.set(singleStart, vecDist(start, goal));
  while (openSet.length) {
    const currentI = openSet.reduce(
      (best, current, currentI) =>
        (fScore.get(openSet[best]) ?? Infinity) <
        (fScore.get(current) ?? Infinity)
          ? best
          : currentI,
      0
    );

    const current = openSet[currentI];
    if (current === singleGoal) return reconstruct_path(cameFrom, current);
    openSet.splice(currentI, 1);
    const currentV = singleToVec(current);
    const neighbors: [number, number][] = [
      [currentV[0] - 1, currentV[1]],
      [currentV[0] + 1, currentV[1]],
      [currentV[0], currentV[1] - 1],
      [currentV[0], currentV[1] + 1],
    ];
    for (const neighbor of neighbors) {
      if (
        neighbor[0] < 0 ||
        neighbor[1] < 0 ||
        neighbor[0] > map.width ||
        neighbor[1] > map.height
      )
        continue;
      const singleNeighbor = vecToSingle(neighbor);
      const tile = at(neighbor[0], neighbor[1]);
      const tentative_gScore =
        (gScore.get(current) ?? Infinity) +
        (singleNeighbor === singleGoal ? 1 : AStarDist[tile[0]]);
      if (tentative_gScore < (gScore.get(singleNeighbor) ?? Infinity)) {
        cameFrom.set(singleNeighbor, current);
        gScore.set(singleNeighbor, tentative_gScore);
        fScore.set(singleNeighbor, tentative_gScore + vecDist(neighbor, goal));
        if (!openSet.includes(singleNeighbor)) openSet.push(singleNeighbor);
      }
    }
  }

  return null;
};
