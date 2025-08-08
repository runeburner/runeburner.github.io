import { Realm } from "../Realm/Realm";
import { runGameSelectors } from "../store/gameRedux";
import { BoundedAABB, IsInAABB, RadiusAABB } from "../types/aabb";
import { ActionProgress } from "../types/actions";
import { EldritchRune } from "../types/eldritchRunes";
import { Entity, EntityType, GolemEntity, HealthEntity } from "../types/entity";
import { Plane, Offset, ValuesPerTile } from "../types/map";
import { Resources } from "../types/resources";
import { Rune } from "../types/rune";
import { Tile } from "../types/tile";
import { dist, Vec } from "../types/vec";
import { Camera } from "../World/World/Camera";
import { leafPower } from "./formulas";
import { ID } from "./id";
import { EntityTicker, launchGolem } from "./launch_golem";

export type UI = {
  inspectedTile: Vec;
};

export type Game = {
  realmId: string;
  realmCompleted: boolean;
  livesLeft: number;
  workers: EntityTicker[];
  resources: Resources;
  powers: {
    leafPower: number;
    musicalStrength: number;
    movePerRune: number;
    capacityPerRune: number;
    workPerRune: number;
  };
  eldritchRunesUnlocked: EldritchRune[];
  completedRealms: string[];
  entities: Map<number, Entity>;
  actions: Map<number, ActionProgress>;
  plane: Plane;
  ui: UI;
  tileAt(v: Vec): Int32Array;
  setTileAt(v: Vec, t: Int32Array): void;
  entityAt(v: Vec): Entity | undefined;
  findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null;
  findAllTiles(pos: Vec, wantTile: Tile, radius: number): Vec[];
  findClosestEntity(pos: Vec, entityType: EntityType): Entity | null;
  findAllEntities(pos: Vec, entityType: EntityType, radius: number): Entity[];
  golemSpawnCoordinates(): Vec | null;
  addMusicalNotes(n: number): void;
  determineInitialCameraPosition(cam: Camera): Camera;
  updateFoW(before: Vec | null, after: Vec | null, radius: number): void;
  canSeeTile(v: Vec): boolean;
  animate(
    runes: Record<Rune, number>,
    incantation: string,
    eldritchRune: EldritchRune | undefined
  ): void;
  loadMap(realm: Realm, map: Plane): void;
  damage<T extends EntityType, V extends object>(
    entity: HealthEntity<T, V>,
    damage: number
  ): boolean;
  removeEntity(id: number): void;
  completeRealm(realm: Realm): void;
};

export const game = ((): Game => {
  return {
    realmId: "",
    realmCompleted: false,
    livesLeft: 0,
    completedRealms: [],
    workers: [],
    resources: {
      musicalNotes: 0,
      leafs: 0,
      golems: 0,
      maxGolems: 3,
    },
    powers: {
      leafPower: 1,
      musicalStrength: 1,
      movePerRune: 2,
      capacityPerRune: 1,
      workPerRune: 1,
    },
    eldritchRunesUnlocked: [],
    entities: new Map(),
    actions: new Map(),
    plane: {
      bounds: new Int32Array(),
      data: new Int32Array(),
    },
    ui: {
      inspectedTile: [0, 0],
    },
    tileAt(v: Vec): Int32Array {
      const start = (v[1] * game.plane.bounds[2] + v[0]) * ValuesPerTile;
      return game.plane.data.slice(start, start + ValuesPerTile);
    },
    setTileAt(v: Vec, t: Int32Array): void {
      const start = (v[1] * game.plane.bounds[2] + v[0]) * ValuesPerTile;
      game.plane.data.set(t, start);
    },
    updateFoW(before: Vec | null, after: Vec | null, radius: number): void {
      if (before !== null) {
        const bounds = BoundedAABB(game.plane.bounds, before, radius);

        for (let i = bounds[0]; i <= bounds[2]; i++) {
          for (let j = bounds[1]; j <= bounds[3]; j++) {
            const x =
              (j * game.plane.bounds[2] + i) * ValuesPerTile +
              Offset.FOG_OF_WAR;
            game.plane.data[x]--;
          }
        }
      }

      if (after !== null) {
        const bounds = BoundedAABB(game.plane.bounds, after, radius);

        for (let i = bounds[0]; i <= bounds[2]; i++) {
          for (let j = bounds[1]; j <= bounds[3]; j++) {
            game.plane.data[
              (j * game.plane.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR
            ]++;
          }
        }
      }
    },
    canSeeTile(v: Vec): boolean {
      return (
        game.plane.data[
          (v[1] * game.plane.bounds[2] + v[0]) * ValuesPerTile +
            Offset.FOG_OF_WAR
        ] !== 0
      );
    },
    entityAt(v: Vec): Entity | undefined {
      return game.entities
        .values()
        .find((e) => e.pos[0] === v[0] && e.pos[1] === v[1]);
    },
    findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null {
      const x = Math.max(0, pos[0] - Math.floor(radius));
      const X = Math.min(game.plane.bounds[2], pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(game.plane.bounds[3], pos[1] + Math.ceil(radius));
      let closestTile: Vec | null = null;
      let closestDist = 1e99;
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v: Vec = [i, j];
          if (!game.canSeeTile(v)) continue;
          const tile = game.tileAt(v);

          if (tile[0] === wantTile && !game.entityAt(v)) {
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
      const X = Math.min(game.plane.bounds[2], pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(game.plane.bounds[3], pos[1] + Math.ceil(radius));

      const tiles: Vec[] = [];
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v: Vec = [i, j];
          if (!game.canSeeTile(v)) continue;
          const tile = game.tileAt(v);

          if (tile[0] === wantTile && !game.entityAt(v)) {
            tiles.push(v);
          }
        }
      }
      return tiles;
    },
    findClosestEntity(pos: Vec, entityType: EntityType): Entity | null {
      const entities = game.entities
        .values()
        .filter((e) => e.__type === entityType);
      const v = entities.reduce(
        (res: [number, Entity | null], e): [number, Entity | null] => {
          const d = dist(e.pos, pos);
          if (d < res[0] && game.canSeeTile(e.pos)) {
            return [d, e];
          }
          return res;
        },
        [1e99, null]
      );
      return v[1];
    },
    findAllEntities(
      pos: Vec,
      entityType: EntityType,
      radius: number
    ): Entity[] {
      const aabb = RadiusAABB(pos, radius);

      return game.entities
        .values()
        .filter((e) => e.__type === entityType && IsInAABB(aabb, e.pos))
        .toArray();
    },
    golemSpawnCoordinates(): Vec | null {
      const heart = game.entities
        .values()
        .find((e) => e.__type === EntityType.HEART);
      if (!heart) return null;
      return game.findClosestTile(heart.pos, Tile.EMPTY, 3);
    },
    addMusicalNotes(n: number): void {
      game.resources.musicalNotes += n;
      game.powers.musicalStrength = Math.pow(
        1.01,
        Math.sqrt(0.5 * game.resources.musicalNotes)
      );
    },

    determineInitialCameraPosition(cam: Camera): Camera {
      const core = game.entities
        .values()
        .find((e) => e.__type === EntityType.HEART);
      return {
        pos: [
          (core?.pos[0] ?? 0) - Math.floor(cam.size[0] / 2),
          (core?.pos[1] ?? 0) - Math.floor(cam.size[1] / 2),
        ],
        size: [...cam.size],
        scale: cam.scale,
      };
    },

    animate(
      runes: Record<Rune, number>,
      incantation: string,
      eldritchRune: EldritchRune | undefined
    ): void {
      if (game.livesLeft <= 0) return;
      game.livesLeft--;
      game.resources.golems++;
      const id = ID.next();
      const coord = game.golemSpawnCoordinates();

      if (!coord) return;
      const golem: GolemEntity = {
        __type: EntityType.GOLEM,
        pos: coord,
        runes: runes,
        id: id,
        visionRange: 5,
        runeCrystals: 0,
        health: [0, 0],
        armor: [0, 0],
        shield: [0, 0],
        mana: [0, 0],
        eldritchRune: eldritchRune,
      };

      launchGolem(golem, incantation).then((success) => {
        game.updateFoW(null, golem.pos, golem.visionRange);
        if (!success) return;
        game.entities.set(id, golem);
      });
    },
    loadMap(realm: Realm, map: Plane): void {
      game.realmId = realm.id;
      game.realmCompleted = false;
      game.livesLeft = realm.golemLives;
      game.resources = {
        musicalNotes: 0,
        leafs: game.resources.leafs,
        golems: 0,
        maxGolems: 3,
      };
      game.powers = {
        leafPower: leafPower(game.resources.leafs),
        musicalStrength: 1,
        movePerRune: 2,
        capacityPerRune: 1,
        workPerRune: 1,
      };
      game.entities.clear();
      const entities = realm.startingEntities();
      for (const entity of entities) {
        game.entities.set(entity.id, entity);
      }

      game.actions.clear();
      game.plane = map;
      for (const e of entities) {
        if ("visionRange" in e) game.updateFoW(null, e.pos, e.visionRange);
      }
    },
    damage<T extends EntityType, V extends object>(
      entity: HealthEntity<T, V>,
      damage: number
    ): boolean {
      if (entity.health[0] > 0) {
        const dmg = Math.min(entity.health[0], damage);
        entity.health[0] -= dmg;
        damage -= dmg;
      }
      if (entity.armor[0] > 0) {
        const dmg = Math.min(entity.armor[0], damage);
        entity.armor[0] -= dmg;
        damage -= dmg;
      }
      if (entity.shield[0] > 0) {
        const dmg = Math.min(entity.shield[0], damage);
        entity.shield[0] -= dmg;
        damage -= dmg;
      }

      const die =
        entity.health[0] === 0 &&
        entity.armor[0] === 0 &&
        entity.shield[0] === 0;

      if (die) game.removeEntity(entity.id);
      return die;
    },
    removeEntity(id: number): void {
      const entity = game.entities.get(id);
      if (!entity) return;

      if (entity.__type === EntityType.GOLEM) game.resources.golems--;
      if ("visionRange" in entity)
        game.updateFoW(entity.pos, null, entity.visionRange);
      game.actions.delete(id);
      game.entities.delete(id);

      // delete actions targetting directly this entity.
      for (const [aid, action] of game.actions.entries()) {
        if (action && "target" in action && action.target === id) {
          game.actions.delete(aid);
        }
      }

      const i = game.workers.findIndex((w) => w.id === id);
      if (i !== -1) game.workers.splice(i, 1);

      return;
    },
    completeRealm(realm: Realm): void {
      game.realmCompleted = false;
      game.realmId = "";
      game.resources.musicalNotes = 0;
      game.livesLeft = 0;
      game.entities.clear();
      game.actions.clear();
      game.workers = [];
      if (!game.completedRealms.includes(realm.id)) {
        game.completedRealms.push(realm.id);
        realm.rewards.forEach((r) => r.apply(game));
      }
      game.powers.leafPower = leafPower(game.resources.leafs);
      runGameSelectors();
    },
  };
})();
