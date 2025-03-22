import { Entity, EntityType } from "../types/entity";
import { ID } from "./id";
import defaultMapData from "./defaultMap.txt?raw";
import { Map, Offset, ValuesPerTile } from "../types/map";
import { Tile } from "../types/tile";

export const parseMap = (s: string): Map => {
  const mapData: number[][][] = [];
  for (const line of s.split("\n")) {
    const row: number[][] = [];
    for (const cell of line.split(",")) {
      const parts = cell.split("/").map((s) => parseInt(s));
      row.push(parts);
    }
    mapData.push(row);
  }

  const width = mapData[0].length;
  const height = mapData.length;
  const bounds = new Int32Array([0, 0, width, height]);
  const data = new Int32Array(width * height * ValuesPerTile);
  for (let j = 0; j < bounds[3]; j++) {
    for (let i = 0; i < bounds[2]; i++) {
      data[(j * width + i) * ValuesPerTile + Offset.TILE_ID] =
        mapData[j][i][Offset.TILE_ID];

      if (mapData[j][i][Offset.TILE_ID] === Tile.MANA_CRYSTAL) {
        data[(j * width + i) * ValuesPerTile + Offset.DATA_0] =
          mapData[j][i][Offset.DATA_0];
        data[(j * width + i) * ValuesPerTile + Offset.DATA_1] =
          mapData[j][i][Offset.DATA_1];
      }
    }
  }

  return {
    bounds,
    data,
  };
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
  {
    __type: EntityType.DUMMY,
    id: ID.next(),
    pos: [8, 8],
    visionRange: 3,
    health: [20, 20],
    armor: [20, 20],
    shield: [20, 20],
  },
];
