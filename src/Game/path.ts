import { Offset } from "../types/map";
import { EnterWeight, Tile } from "../types/tile";
import { dist, eq, Vec } from "../types/vec";
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
  const hashedStart = hashVec(start);
  const hashedGoal = hashVec(goal);
  const openSet = [hashVec(start)];

  const cameFrom = new Map<number, number>();
  // gScore[n] is the currently known cost of the cheapest path from start to n.
  const gScore = new InfMap();
  gScore.set(hashedStart, 0);
  // fScore[n] represents our current best guess as to how cheap
  // a path could be from start to finish if it goes through n.
  const fScore = new InfMap();
  fScore.set(hashedStart, dist(start, goal));
  while (openSet.length) {
    const currentI = openSet.reduce(
      (best, current, currentI) =>
        fScore.get(openSet[best]) < fScore.get(current) ? best : currentI,
      0
    );
    const current = openSet[currentI];

    if (current === hashedGoal) return reconstruct_path(cameFrom, current);
    openSet.splice(currentI, 1);

    const currentV = unhashVec(current);
    const neighbors: Vec[] = [
      [currentV[0] - 1, currentV[1] - 1],
      [currentV[0] + 1, currentV[1] - 1],
      [currentV[0] - 1, currentV[1] + 1],
      [currentV[0] + 1, currentV[1] + 1],
      [currentV[0] - 1, currentV[1]],
      [currentV[0] + 1, currentV[1]],
      [currentV[0], currentV[1] - 1],
      [currentV[0], currentV[1] + 1],
    ];
    for (const neighbor of neighbors) {
      const isOutsideBounds =
        neighbor[0] < 0 ||
        neighbor[1] < 0 ||
        neighbor[0] > game.plane.bounds[2] ||
        neighbor[1] > game.plane.bounds[3];
      if (isOutsideBounds) continue;

      const isOccupied = game.entities
        .values()
        .some((e) => eq(e.pos, neighbor));
      const hashedNeighbor = hashVec(neighbor);
      const tile = game.tileAt(neighbor);
      const moveWeight =
        hashedNeighbor === hashedGoal
          ? 0
          : EnterWeight[tile[Offset.TILE_ID] as Tile] +
            (isOccupied && hashedNeighbor !== hashedGoal ? Infinity : 0);
      const tentative_gScore = gScore.get(current) + moveWeight;
      if (tentative_gScore < gScore.get(hashedNeighbor)) {
        cameFrom.set(hashedNeighbor, current);
        gScore.set(hashedNeighbor, tentative_gScore);
        fScore.set(hashedNeighbor, tentative_gScore + dist(neighbor, goal));
        if (!openSet.includes(hashedNeighbor)) openSet.push(hashedNeighbor);
      }
    }
  }

  return null;
};
