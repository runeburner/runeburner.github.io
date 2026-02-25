import { Realm } from "../Realm/Realm";
import { runGameSelectors } from "../store/gameRedux";
import { AABB, BoundedAABB, IsInAABB, RadiusAABB } from "../types/aabb";
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
import { LaborMelody, VoidMelody, WindMelody } from "./Melodies/Melodies";
import { SpecialEffect } from "./SpecialEffect";

export type UI = {
  inspectedTile: Vec;
  camera: AABB;
  events: SpecialEffect[];
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
  framesLeft: number;
  melodies: Record<string, boolean>;
  choords: number;
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
    eldritchRune: EldritchRune | undefined,
  ): void;
  loadMap(realm: Realm, map: Plane): void;
  damage<T extends EntityType, V extends object>(
    entity: HealthEntity<T, V>,
    damage: number,
  ): boolean;
  removeEntity(id: number): void;
  completeRealm(realm: Realm): void;
  addSpecialEffect(effect: SpecialEffect): void;
  unlockMelody(id: string): void;
};

export const freshGame = (): Game => {
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
      camera: new Int32Array([0, 0, 0, 0]),
      events: [],
    },
    framesLeft: Infinity,
    melodies: {
      [WindMelody.id]: true,
      [LaborMelody.id]: true,
      [VoidMelody.id]: true,
    },
    choords: 0,
    tileAt(v: Vec): Int32Array {
      const start = (v[1] * this.plane.bounds[2] + v[0]) * ValuesPerTile;
      return this.plane.data.slice(start, start + ValuesPerTile);
    },
    setTileAt(v: Vec, t: Int32Array): void {
      const start = (v[1] * this.plane.bounds[2] + v[0]) * ValuesPerTile;
      this.plane.data.set(t, start);
    },
    updateFoW(before: Vec | null, after: Vec | null, radius: number): void {
      if (before !== null) {
        const bounds = BoundedAABB(this.plane.bounds, before, radius);

        for (let i = bounds[0]; i <= bounds[2]; i++) {
          for (let j = bounds[1]; j <= bounds[3]; j++) {
            const x =
              (j * this.plane.bounds[2] + i) * ValuesPerTile +
              Offset.FOG_OF_WAR;
            this.plane.data[x]--;
          }
        }
      }

      if (after !== null) {
        const bounds = BoundedAABB(this.plane.bounds, after, radius);

        for (let i = bounds[0]; i <= bounds[2]; i++) {
          for (let j = bounds[1]; j <= bounds[3]; j++) {
            this.plane.data[
              (j * this.plane.bounds[2] + i) * ValuesPerTile + Offset.FOG_OF_WAR
            ]++;
          }
        }
      }
    },
    canSeeTile(v: Vec): boolean {
      return (
        this.plane.data[
          (v[1] * this.plane.bounds[2] + v[0]) * ValuesPerTile +
            Offset.FOG_OF_WAR
        ] !== 0
      );
    },
    entityAt(v: Vec): Entity | undefined {
      return this.entities
        .values()
        .find((e) => e.pos[0] === v[0] && e.pos[1] === v[1]);
    },
    findClosestTile(pos: Vec, wantTile: Tile, radius: number): Vec | null {
      const x = Math.max(0, pos[0] - Math.floor(radius));
      const X = Math.min(this.plane.bounds[2], pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(this.plane.bounds[3], pos[1] + Math.ceil(radius));
      let closestTile: Vec | null = null;
      let closestDist = 1e99;
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v: Vec = [i, j];
          if (!this.canSeeTile(v)) continue;
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
      const X = Math.min(this.plane.bounds[2], pos[0] + Math.ceil(radius));
      const y = Math.max(0, pos[1] - Math.floor(radius));
      const Y = Math.min(this.plane.bounds[3], pos[1] + Math.ceil(radius));

      const tiles: Vec[] = [];
      for (let j = y; j < Y; j++) {
        for (let i = x; i < X; i++) {
          const v: Vec = [i, j];
          if (!this.canSeeTile(v)) continue;
          const tile = this.tileAt(v);

          if (tile[0] === wantTile && !this.entityAt(v)) {
            tiles.push(v);
          }
        }
      }
      return tiles;
    },
    findClosestEntity(pos: Vec, entityType: EntityType): Entity | null {
      const entities = this.entities
        .values()
        .filter((e) => e.__type === entityType);
      const v = entities.reduce(
        (res: [number, Entity | null], e): [number, Entity | null] => {
          const d = dist(e.pos, pos);
          if (d < res[0] && this.canSeeTile(e.pos)) {
            return [d, e];
          }
          return res;
        },
        [1e99, null],
      );
      return v[1];
    },
    findAllEntities(
      pos: Vec,
      entityType: EntityType,
      radius: number,
    ): Entity[] {
      const aabb = RadiusAABB(pos, radius);

      return this.entities
        .values()
        .filter((e) => e.__type === entityType && IsInAABB(aabb, e.pos))
        .toArray();
    },
    golemSpawnCoordinates(): Vec | null {
      const heart = this.entities
        .values()
        .find((e) => e.__type === EntityType.HEART);
      if (!heart) return null;
      return this.findClosestTile(heart.pos, Tile.EMPTY, 3);
    },
    addMusicalNotes(n: number): void {
      this.resources.musicalNotes += n;
      this.powers.musicalStrength = Math.pow(
        1.01,
        Math.sqrt(0.5 * this.resources.musicalNotes),
      );
    },

    determineInitialCameraPosition(cam: Camera): Camera {
      const core = this.entities
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
      eldritchRune: EldritchRune | undefined,
    ): void {
      if (this.livesLeft <= 0) return;
      this.livesLeft--;
      this.resources.golems++;
      const id = ID.next();
      const coord = this.golemSpawnCoordinates();

      if (!coord) return;
      const golem: GolemEntity = {
        __type: EntityType.GOLEM,
        pos: coord,
        runes: runes,
        id: id,
        visionRange: 5,
        runeCrystals: 0,
        health: [runes[Rune.HEALTH] * 5, runes[Rune.HEALTH] * 5],
        armor: [0, 0],
        shield: [0, 0],
        mana: [0, 0],
        eldritchRune: eldritchRune,
      };

      launchGolem(golem, incantation).then((success) => {
        this.updateFoW(null, golem.pos, golem.visionRange);
        if (!success) return;
        this.entities.set(id, golem);
      });
    },
    loadMap(realm: Realm, map: Plane): void {
      this.realmId = realm.id;
      this.realmCompleted = false;
      this.livesLeft = realm.golemLives;
      this.resources = {
        musicalNotes: 0,
        leafs: this.resources.leafs,
        golems: 0,
        maxGolems: 3,
      };
      this.powers = {
        leafPower: leafPower(this.resources.leafs),
        musicalStrength: 1,
        movePerRune: 2,
        capacityPerRune: 1,
        workPerRune: 1,
      };
      this.entities.clear();
      const entities = realm.startingEntities();
      for (const entity of entities) {
        this.entities.set(entity.id, entity);
      }

      this.actions.clear();
      this.plane = map;
      for (const e of entities) {
        if ("visionRange" in e) this.updateFoW(null, e.pos, e.visionRange);
      }
    },
    damage<T extends EntityType, V extends object>(
      entity: HealthEntity<T, V>,
      damage: number,
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

      if (die) this.removeEntity(entity.id);
      return die;
    },
    removeEntity(id: number): void {
      const entity = this.entities.get(id);
      if (!entity) return;

      if (entity.__type === EntityType.GOLEM) this.resources.golems--;
      if ("visionRange" in entity)
        this.updateFoW(entity.pos, null, entity.visionRange);
      this.actions.delete(id);
      this.entities.delete(id);

      // delete actions targetting directly this entity.
      for (const [aid, action] of this.actions.entries()) {
        if (action && "target" in action && action.target === id) {
          this.actions.delete(aid);
        }
      }

      const i = this.workers.findIndex((w) => w.id === id);
      if (i !== -1) this.workers.splice(i, 1);

      return;
    },
    completeRealm(realm: Realm): void {
      this.realmCompleted = false;
      this.realmId = "";
      this.resources.musicalNotes = 0;
      this.livesLeft = 0;
      this.entities.clear();
      this.actions.clear();
      this.workers = [];
      if (!this.completedRealms.includes(realm.id)) {
        this.completedRealms.push(realm.id);
        realm.rewards.forEach((r) => r.apply(game));
      }
      this.powers.leafPower = leafPower(this.resources.leafs);
      runGameSelectors();
    },

    addSpecialEffect(effect: SpecialEffect): void {
      this.ui.events.push(effect);
    },

    unlockMelody(id: string): void {
      if (this.choords <= 0 || this.melodies[id]) return;
      this.choords--;
      this.melodies[id] = true;
    },
  };
};

export const game = freshGame();

export const resetGame = (): void => {
  Object.assign(game, freshGame());
};
