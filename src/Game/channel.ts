import { EntityType, GolemEntity } from "../types/entity";
import {
  GameThreadUIChannel,
  GameThreadUIHandler,
  MapData,
  UIMessageType,
} from "../types/uiMessages";
import { ValuesPerTile } from "../types/map";
import { launchGolem } from "./launch_golem";
import { Rune, RuneWeight } from "../types/rune";
import { game } from "./game";
import { camera } from "./camera";
import { ID } from "./id";

export const channel: GameThreadUIChannel = new BroadcastChannel("UI");

export const generateUIMapData = (): MapData => {
  const x = Math.max(0, camera.c.pos[0]);
  const y = Math.max(0, camera.c.pos[1]);
  const X = Math.min(game.map.bounds[2], camera.c.pos[0] + camera.c.size[0]);
  const Y = Math.min(game.map.bounds[3], camera.c.pos[1] + camera.c.size[1]);
  const width = X - x;
  const height = Y - y;
  const data = new Int32Array(width * height * ValuesPerTile);
  for (let j = y; j < Y; j++) {
    const offset = (j - y) * width * ValuesPerTile;
    data.set(
      game.map.data.slice(
        (j * game.map.bounds[2] + x) * ValuesPerTile,
        (j * game.map.bounds[2] + X) * ValuesPerTile
      ),
      offset
    );
  }

  return {
    pos: [x, y],
    map: {
      width,
      height,
      data,
    },
    entityIDs: Object.values(game.entityM)
      .filter((e) => camera.isInView(e.pos))
      .map((e) => e.id),
  } satisfies MapData;
};

const handlers: GameThreadUIHandler = {
  [UIMessageType.INITIALIZE]: (initialCam) => {
    const cam = game.determineInitialCameraPosition(initialCam);

    Object.assign(camera.c, cam);
    channel.postMessage({
      __type: UIMessageType.MAP,
      data: { ...generateUIMapData(), camera: camera.c },
    });
  },
  [UIMessageType.DEINITIALIZE]: () => {
    camera.c.pos = [0, 0];
    camera.c.size = [0, 0];
  },
  [UIMessageType.QUERY]: (cam) => {
    Object.assign(camera.c, cam);
    channel.postMessage({
      __type: UIMessageType.MAP,
      data: generateUIMapData(),
    });
  },
  [UIMessageType.ANIMATE]: (data) => {
    const id = ID.next();
    const weight = data.runes.reduce(
      (weight, rune) => weight + RuneWeight[rune[0]] * rune[1],
      0
    );
    const coord = game.golemSpawnCoordinates();
    if (!coord) return;
    const golem = {
      __type: EntityType.GOLEM,
      pos: coord,
      runes: data.runes,
      id: id,
      speed: data.runes.find((r) => r[0] === Rune.WIND)?.[1] ?? 0,
      weight: Math.max(1, weight),
      visionRange: 5,
      minecapacity: [0, data.runes.find((r) => r[0] === Rune.VOID)?.[1] ?? 0],
      mineSpeed: data.runes.find((r) => r[0] === Rune.LABOR)?.[1] ?? 0,
      health: [0, 0],
      armor: [0, 0],
      shield: [0, 0],
      mana: [0, 0],
    } satisfies GolemEntity;

    launchGolem(id, data.incantation).then((success) => {
      game.updateFoW(null, golem.pos, golem.visionRange);
      if (!success) return;
      game.entityM[id] = golem;
      channel.postMessage({
        __type: UIMessageType.ADD_ENTITY,
        data: golem.id,
      });
    });
  },
  [UIMessageType.REFRESH_ENTITY]: (entityID) => {
    const entity = game.entityM[entityID];
    const actProgress = game.actionM[entityID];
    channel.postMessage({
      __type: UIMessageType.UPDATE_ENTITY,
      data: { entity, action: actProgress },
    });
  },
};

channel.onmessage = ({ data }): void => handlers[data.__type]?.(data.data);

// Send to the main thread that the game is ready
new BroadcastChannel("READY").postMessage("");
