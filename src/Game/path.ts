import { Offset } from "../types/map";
import { EnterWeight, Tile } from "../types/tile";
import { eq, Vec } from "../types/vec";
import { game } from "./game";
import { MinHeap } from "./heap";
import { InfMap } from "./InfMap";

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

// this dist formula will properly sort all possible tiles by their
// most direct path visually while keeping actual shortest path
const distEstimate = (v0: Vec, v1: Vec): number =>
  Math.abs(v0[0] - v1[0]) + Math.abs(v0[1] - v1[1]);

export const aStarPath = (start: Vec, goal: Vec): Vec[] | null => {
  const hashedStart = hashVec(start);
  const hashedGoal = hashVec(goal);
  // fScore[n] represents our current best guess as to how cheap
  // a path could be from start to finish if it goes through n.
  const fScore = new InfMap();
  fScore.set(hashedStart, distEstimate(start, goal));
  const openSet = new MinHeap(fScore);
  openSet.insert(hashVec(start));

  const cameFrom = new Map<number, number>();
  // gScore[n] is the currently known cost of the cheapest path from start to n.
  const gScore = new InfMap();
  gScore.set(hashedStart, 0);
  while (openSet.size()) {
    const current = openSet.removeMin();

    if (current === hashedGoal) return reconstruct_path(cameFrom, current);

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
        fScore.set(
          hashedNeighbor,
          tentative_gScore + distEstimate(neighbor, goal)
        );
        if (!openSet.includes(hashedNeighbor)) openSet.insert(hashedNeighbor);
        else openSet.heapifyDown();
      }
    }
  }

  return null;
};
