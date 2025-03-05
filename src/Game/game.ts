import { MapBoundedAABB } from "../types/aabb";
import { ActionProgress } from "../types/actions";
import { Entity, EntityType } from "../types/entity";
import { Map, Offset, ValuesPerTile } from "../types/map";
import { Resources } from "../types/resources";
import { Tile } from "../types/tile";
import { Camera, UIMessageType } from "../types/uiMessages";
import { dist, Vec } from "../types/vec";
import { camera } from "./camera";
import { channel, generateUIMapData } from "./channel";
import { defaultEntities, defaultMap } from "./defaultValues";
import { EntityTicker } from "./launch_golem";

type Game = {
  workers: EntityTicker[];
  resources: Resources;
  powers: {
    attune_power: number;
  };
  entityM: Record<number, Entity>;
  actionM: Record<number, ActionProgress>;
  map: Map;
  tileAt(v: Vec): Int32Array;
  setTileAt(v: Vec, t: Int32Array): void;
  entityAt(v: Vec): Entity | undefined;
  findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null;
  findClosestEntity(pos: Vec, entityType: EntityType): Vec | null;
  golemSpawnCoordinates(): Vec | null;
  addAttunement(n: number): void;
  determineInitialCameraPosition(cam: Camera): Camera;
  updateFoW(before: Vec | null, after: Vec, radius: number): void;
};

export const game = ((): Game => {
  return {
    workers: [],
    resources: {
      attunement: 0,
    },
    powers: {
      attune_power: 1,
    },
    entityM: defaultEntities.reduce((m, e) => ({ ...m, [e.id]: e }), {}),
    actionM: {},
    map: ((): Map => {
      const width = defaultMap[0].length;
      const height = defaultMap.length;
      const mapAABB = new Int32Array([0, 0, width, height]);
      const data = new Int32Array(width * height * ValuesPerTile);
      for (let j = 0; j < mapAABB[2]; j++) {
        for (let i = 0; i < mapAABB[3]; i++) {
          data[(j * width + i) * ValuesPerTile + Offset.TILE_ID] =
            defaultMap[j][i];

          // fill mana crystal quantity
          if (defaultMap[j][i] === Tile.MANA_CRYSTAL) {
            data[(j * width + i) * ValuesPerTile + Offset.DATA_0] = 16;
          }
        }
      }
      for (const e of defaultEntities) {
        const bounds = MapBoundedAABB(mapAABB, e.pos, e.visionRange);
        for (let i = bounds[0]; i < bounds[2]; i++) {
          for (let j = bounds[1]; j < bounds[3]; j++) {
            data[(j * width + i) * ValuesPerTile + Offset.FOG_OF_WAR]++;
          }
        }
      }
      return {
        width,
        height,
        data,
      };
    })(),
    tileAt(v: Vec): Int32Array {
      const start = (v[1] * this.map.width + v[0]) * ValuesPerTile;
      return this.map.data.slice(start, start + ValuesPerTile);
    },
    setTileAt(v: Vec, t: Int32Array): void {
      const start = (v[1] * this.map.width + v[0]) * ValuesPerTile;
      this.map.data.set(t, start);
      if (camera.isInView(v)) {
        channel.postMessage({
          __type: UIMessageType.MAP,
          data: generateUIMapData(),
        });
      }
    },
    updateFoW(before: Vec | null, after: Vec, radius: number): void {
      console.log(before, after, radius);
    },
    entityAt(v: Vec): Entity | undefined {
      return Object.values(this.entityM).find(
        (e) => e.pos[0] === v[0] && e.pos[1] === v[1]
      );
    },
    findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null {
      const x = Math.max(0, pos[0] - Math.floor(radius));
      const X = Math.min(this.map.width, pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(this.map.height, pos[1] + Math.ceil(radius));
      let closestTile: Vec | null = null;
      let closestDist = 1e99;
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v = [i, j] satisfies Vec;
          const tile = this.tileAt(v);

          if (tile[0] === wantTile && !this.entityAt(v)) {
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
    findClosestEntity(pos: Vec, entityType: EntityType): Vec | null {
      const entities = Object.values(game.entityM).filter(
        (e) => e.__type === entityType
      );
      if (entities.length === 0) return null;
      const v = entities.reduce(
        (res: [number, Vec], e): [number, Vec] => {
          const d = dist(e.pos, pos);
          if (d < res[0]) {
            return [d, [...e.pos]];
          }
          return res;
        },
        [1e99, entities[0].pos]
      );
      return v[1];
    },
    golemSpawnCoordinates(): Vec | null {
      const heart = Object.values(this.entityM).find(
        (e) => e.__type === EntityType.HEART
      );
      if (!heart) return null;
      return this.findClosestTile(heart.pos, Tile.EMPTY, 3);
    },
    addAttunement(n: number): void {
      this.resources.attunement += n;
      this.powers.attune_power = Math.pow(
        1.01,
        Math.sqrt(0.5 * this.resources.attunement)
      );
      channel.postMessage({
        __type: UIMessageType.RESOURCES,
        data: this.resources,
      });
    },

    determineInitialCameraPosition: (cam: Camera): Camera => {
      const core = Object.values(game.entityM).find(
        (e) => e.__type === EntityType.HEART
      );
      return {
        pos: [
          (core?.pos[0] ?? 0) - Math.floor(cam.size[0] / 2),
          (core?.pos[1] ?? 0) - Math.floor(cam.size[1] / 2),
        ],
        size: [...cam.size],
      };
    },
  };
})();
