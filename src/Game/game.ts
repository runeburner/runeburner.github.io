import { setAttunement } from "../store/resources";
import { store } from "../store/store";
import { BoundedAABB } from "../types/aabb";
import { ActionProgress } from "../types/actions";
import { Entity, EntityType, GolemEntity } from "../types/entity";
import { Map, Offset, ValuesPerTile } from "../types/map";
import { Resources } from "../types/resources";
import { Rune, RuneWeight } from "../types/rune";
import { Tile } from "../types/tile";
import { dist, Vec } from "../types/vec";
import { Camera } from "../World/World/Camera";
import { defaultEntities, defaultMap } from "./defaultValues";
import { ID } from "./id";
import { EntityTicker, launchGolem } from "./launch_golem";

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
  findAllTiles(pos: Vec, wantTile: Tile, radius: number): Vec[];
  findClosestEntity(pos: Vec, entityType: EntityType): Vec | null;
  golemSpawnCoordinates(): Vec | null;
  addAttunement(n: number): void;
  determineInitialCameraPosition(cam: Camera): Camera;
  updateFoW(before: Vec | null, after: Vec, radius: number): void;
  animate(runes: [Rune, number][], incantation: string): void;
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
    entityM: ((): Record<string, Entity> => {
      const entities = defaultEntities.reduce(
        (m, e) => ({ ...m, [e.id]: e }),
        {}
      ) as Record<string, Entity>;
      return entities;
    })(),
    actionM: {},
    map: ((): Map => {
      const { bounds, data } = defaultMap;
      for (const e of defaultEntities) {
        const visionBounds = BoundedAABB(bounds, e.pos, e.visionRange);
        for (let i = visionBounds[0]; i <= visionBounds[2]; i++) {
          for (let j = visionBounds[1]; j <= visionBounds[3]; j++) {
            data[(j * bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR]++;
          }
        }
      }
      return defaultMap;
    })(),
    tileAt(v: Vec): Int32Array {
      const start = (v[1] * this.map.bounds[2] + v[0]) * ValuesPerTile;
      return this.map.data.slice(start, start + ValuesPerTile);
    },
    setTileAt(v: Vec, t: Int32Array): void {
      const start = (v[1] * this.map.bounds[2] + v[0]) * ValuesPerTile;
      this.map.data.set(t, start);
    },
    updateFoW(before: Vec | null, after: Vec, radius: number): void {
      if (before !== null) {
        const bounds = BoundedAABB(this.map.bounds, before, radius);

        for (let i = bounds[0]; i <= bounds[2]; i++) {
          for (let j = bounds[1]; j <= bounds[3]; j++) {
            const x =
              (j * this.map.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR;
            this.map.data[x]--;
          }
        }
      }

      const bounds = BoundedAABB(this.map.bounds, after, radius);

      for (let i = bounds[0]; i <= bounds[2]; i++) {
        for (let j = bounds[1]; j <= bounds[3]; j++) {
          this.map.data[
            (j * this.map.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR
          ]++;
        }
      }
    },
    entityAt(v: Vec): Entity | undefined {
      return Object.values(this.entityM).find(
        (e) => e.pos[0] === v[0] && e.pos[1] === v[1]
      );
    },
    findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null {
      const x = Math.max(0, pos[0] - Math.floor(radius));
      const X = Math.min(this.map.bounds[2], pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(this.map.bounds[3], pos[1] + Math.ceil(radius));
      let closestTile: Vec | null = null;
      let closestDist = 1e99;
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v: Vec = [i, j];
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
    findAllTiles(pos: Vec, wantTile: Tile, radius: number): Vec[] {
      const x = Math.max(0, pos[0] - Math.floor(radius));
      const X = Math.min(this.map.bounds[2], pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(this.map.bounds[3], pos[1] + Math.ceil(radius));

      const tiles: Vec[] = [];
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v: Vec = [i, j];
          const tile = this.tileAt(v);

          if (tile[0] === wantTile && !this.entityAt(v)) {
            tiles.push(v);
          }
        }
      }
      return tiles;
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
      store.dispatch(setAttunement(this.resources.attunement));
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
        scale: cam.scale,
      };
    },

    animate: (runes: [Rune, number][], incantation: string): void => {
      const id = ID.next();
      const weight = runes.reduce(
        (weight, rune) => weight + RuneWeight[rune[0]] * rune[1],
        0
      );
      const coord = game.golemSpawnCoordinates();
      if (!coord) return;
      const golem: GolemEntity = {
        __type: EntityType.GOLEM,
        pos: coord,
        runes: runes,
        id: id,
        speed: runes.find((r) => r[0] === Rune.WIND)?.[1] ?? 0,
        weight: Math.max(1, weight),
        visionRange: 5,
        minecapacity: [0, runes.find((r) => r[0] === Rune.VOID)?.[1] ?? 0],
        mineSpeed: runes.find((r) => r[0] === Rune.LABOR)?.[1] ?? 0,
        health: [0, 0],
        armor: [0, 0],
        shield: [0, 0],
        mana: [0, 0],
      };

      launchGolem(id, incantation).then((success) => {
        game.updateFoW(null, golem.pos, golem.visionRange);
        if (!success) return;
        game.entityM[id] = golem;
      });
    },
  };
})();
