import { EnterWeight, Tile } from "../types/tile";
import { dist, Vec } from "../types/vec";
import { game } from "./game";

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

class InfMap {
  m = new Map<number, number>();
  get(key: number): number {
    return this.m.get(key) ?? Infinity;
  }
  set(key: number, n: number): void {
    this.m.set(key, n);
  }
}

export const aStarPath = (start: Vec, goal: Vec): Vec[] | null => {
  const singleStart = hashVec(start);
  const singleGoal = hashVec(goal);
  const openSet = [hashVec(start)];
  const cameFrom = new Map<number, number>();
  const gScore = new InfMap();
  gScore.set(singleStart, 0);
  const fScore = new InfMap();
  fScore.set(singleStart, dist(start, goal));
  while (openSet.length) {
    const currentI = openSet.reduce(
      (best, current, currentI) =>
        fScore.get(openSet[best]) < fScore.get(current) ? best : currentI,
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
        neighbor[0] > game.map.width ||
        neighbor[1] > game.map.height ||
        game.entities.find(
          (e) => e.pos[0] === neighbor[0] && e.pos[1] === neighbor[1]
        )
      )
        continue;
      const singleNeighbor = hashVec(neighbor);
      const tile = game.at(neighbor);
      const tentative_gScore =
        gScore.get(current) +
        (singleNeighbor === singleGoal ? 1 : EnterWeight[tile[0] as Tile]);
      if (tentative_gScore < gScore.get(singleNeighbor)) {
        cameFrom.set(singleNeighbor, current);
        gScore.set(singleNeighbor, tentative_gScore);
        fScore.set(singleNeighbor, tentative_gScore + dist(neighbor, goal));
        if (!openSet.includes(singleNeighbor)) openSet.push(singleNeighbor);
      }
    }
  }

  return null;
};
