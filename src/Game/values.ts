import { Action } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { Map as GameMap, ValuesPerTile } from "../types/map";
import { Camera } from "../types/uiMessages";
import { AStarDist } from "../types/tile";
import { Vec } from "../types/vec";

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
    pos: [2, 2],
  },
];
export const determineInitialCameraPosition = (cam: Camera): Camera => {
  const core = entities.find((e) => e.type === EntityType.HEART);
  return {
    pos: [
      (core?.pos[0] ?? 0) - Math.floor(cam.size[0] / 2),
      (core?.pos[1] ?? 0) - Math.floor(cam.size[1] / 2),
    ],
    size: [...cam.size],
  };
};

export const at = (x: number, y: number): Int32Array => {
  const start = (y * map.width + x) * ValuesPerTile;
  return map.data.slice(start, start + ValuesPerTile);
};

// This hashing function will not work for coordinates outside {[0,0], [94_906_265, 94_906_265]}
const hashMaxWidth = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER));

const hashVec = (point: Vec): number => point[0] * hashMaxWidth + point[1];

const unhashVec = (single: number): Vec => [
  Math.floor(single / hashMaxWidth),
  single % hashMaxWidth,
];

const reconstruct_path = (
  cameFrom: Map<number, number>,
  current: number
): Vec[] => {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }

  return path.map((p) => unhashVec(p));
};

export const vecDist = (v0: Vec, v1: Vec): number =>
  Math.abs(v0[0] - v1[0]) + Math.abs(v0[1] - v1[1]);

export const aStarPath = (start: Vec, goal: Vec): Vec[] | null => {
  const singleStart = hashVec(start);
  const singleGoal = hashVec(goal);
  const openSet = [hashVec(start)];
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
    const currentV = unhashVec(current);
    const neighbors: Vec[] = [
      [currentV[0] - 1, currentV[1]],
      [currentV[0] + 1, currentV[1]],
      [currentV[0], currentV[1] - 1],
      [currentV[0], currentV[1] + 1],
      [currentV[0] - 1, currentV[1] - 1],
      [currentV[0] + 1, currentV[1] - 1],
      [currentV[0] + 1, currentV[1] - 1],
      [currentV[0] + 1, currentV[1] + 1],
    ];
    for (const neighbor of neighbors) {
      if (
        neighbor[0] < 0 ||
        neighbor[1] < 0 ||
        neighbor[0] > map.width ||
        neighbor[1] > map.height ||
        entities.find(
          (e) => e.pos[0] === neighbor[0] && e.pos[1] === neighbor[1]
        )
      )
        continue;
      const singleNeighbor = hashVec(neighbor);
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
