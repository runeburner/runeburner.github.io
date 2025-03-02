import { ACTProgress } from "../types/ACT";
import { Entity, EntityType } from "../types/entity";
import { Map, ValuesPerTile } from "../types/map";
import { Tile } from "../types/tile";
import { UIMessageType } from "../types/uiMessages";
import { dist, Vec } from "../types/vec";
import { channel } from "./channel";
import { defaultEntities, defaultMap } from "./defaultValues";
import { Worker } from "./launch_golem";

type Game = {
  workers: Worker[];
  resources: {
    attunement: number;
  };
  entityM: Record<number, Entity>;
  actionM: Record<number, ACTProgress>;
  entities: Entity[];
  map: Map;
  tileAt(v: Vec): Int32Array;
  entityAt(v: Vec): Entity | undefined;
  findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null;
  findClosestEntity(pos: Vec, entityType: EntityType): Vec | null;
  golemSpawnCoordinates(): Vec | null;
  addAttunement(n: number): void;
};

export const game = ((): Game => {
  return {
    workers: [] as Worker[],
    resources: {
      attunement: 0,
    },
    entityM: defaultEntities.reduce(
      (m, e) => ({ ...m, [e.id]: e }),
      {}
    ) as Record<number, Entity>,
    actionM: {} as Record<number, ACTProgress>,
    entities: defaultEntities,
    map: ((): Map => {
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
    tileAt(v: Vec): Int32Array {
      const start = (v[1] * this.map.width + v[0]) * ValuesPerTile;
      return this.map.data.slice(start, start + ValuesPerTile);
    },
    entityAt(v: Vec): Entity | undefined {
      return this.entities.find((e) => e.pos[0] === v[0] && e.pos[1] === v[1]);
    },
    findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null {
      const x = Math.max(0, pos[0] - Math.floor(radius / 2));
      const X = Math.min(this.map.width, pos[0] + Math.ceil(radius / 2));
      const y = Math.max(0, pos[1] - Math.floor(radius / 2));
      const Y = Math.min(this.map.height, pos[1] + Math.ceil(radius / 2));
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
        (e) => e.type === entityType
      );
      if (entities.length === 0) return null;
      const v = entities.reduce(
        (res: [number, Vec], e) => {
          const d = dist(e.pos, pos);
          if (d < res[0]) {
            return [d, [...e.pos]] as [number, Vec];
          }
          return res as [number, Vec];
        },
        [1e99, entities[0].pos]
      );
      return v[1];
    },
    golemSpawnCoordinates(): Vec | null {
      const heart = this.entities.find((e) => e.type === EntityType.HEART);
      if (!heart) return null;
      return this.findClosestTile(heart.pos, Tile.EMPTY, 3);
    },
    addAttunement(n: number): void {
      this.resources.attunement += n;
      channel.postMessage({
        type: UIMessageType.RESOURCES,
        data: this.resources,
      });
    },
  };
})();
