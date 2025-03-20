import { Entity, EntityType } from "../types/entity";
import { ID } from "./id";
import defaultMapData from "./defaultMap.txt?raw";

export const parseMap = (s: string): number[][][] => {
  const mapData: number[][][] = [];
  for (const line of s.split("\n")) {
    const row: number[][] = [];
    for (const cell of line.split(",")) {
      const parts = cell.split("/").map((s) => parseInt(s));
      row.push(parts);
    }
    mapData.push(row);
  }
  return mapData;
};

export const defaultMap = parseMap(defaultMapData);

export const defaultEntities: Entity[] = [
  {
    __type: EntityType.HEART,
    id: ID.next(),
    pos: [5, 5],
    attunement: 0,
    visionRange: 5,
    health: [50, 50],
    armor: [0, 0],
    shield: [0, 0],
  },
];
