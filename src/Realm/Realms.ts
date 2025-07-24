import { game } from "../Game/game";
import { Offset, Plane, ValuesPerTile } from "../types/map";
import { Realm } from "./Realm";

export const registerRealm = (realm: Realm): void => {
  Realms.push(realm);
};

export const Realms: Realm[] = [
  //   {
  //     id: "tutorial_0",
  //     location: [19, 11],
  //     mapData: tutorial0Map,
  //     startingEntities: Tutorial_0_entities,
  //   },
  //   {
  //     id: "tutorial_1",
  //     location: [18, 13],
  //     parent: "tutorial_0",
  //     mapData: "",
  //     startingEntities: [],
  //   },
];

export const loadRealm = (realm: Realm): void => {
  game.loadMap(realm.startingEntities, parseMap(realm.mapData));
};

export const parseMap = (s: string): Plane => {
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

      if (
        mapData[j][i][Offset.TILE_ID] === Tile.RUNE_CRYSTAL ||
        mapData[j][i][Offset.TILE_ID] === Tile.ROCK
      ) {
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
