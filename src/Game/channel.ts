import { EntityType, GolemEntity } from "../types/entity";
import {
  GameThreadUIChannel,
  GameThreadUIHandler,
  MapData,
  UIMessageType,
} from "../types/uiMessages";
import { ValuesPerTile } from "../types/map";
import { determineInitialCameraPosition } from "./values";
import { launchGolem } from "./launch_golem";
import { Rune, RuneWeight } from "../types/rune";
import { game } from "./game";
import { camera } from "./camera";
import { ID } from "./id";

export const channel: GameThreadUIChannel = new BroadcastChannel("UI");

const generateUIMapData = (): MapData => {
  const x = Math.max(0, camera.c.pos[0]);
  const y = Math.max(0, camera.c.pos[1]);
  const X = Math.min(game.map.width, camera.c.pos[0] + camera.c.size[0]);
  const Y = Math.min(game.map.height, camera.c.pos[1] + camera.c.size[1]);
  const width = X - x;
  const height = Y - y;
  const data = new Int32Array(width * height * ValuesPerTile);
  for (let j = y; j < Y; j++) {
    const offset = (j - y) * width * ValuesPerTile;
    data.set(
      game.map.data.slice(
        (j * game.map.width + x) * ValuesPerTile,
        (j * game.map.width + X) * ValuesPerTile
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
    entities: game.entities
      .filter((e) => camera.isInView(e.pos))
      .map((e) => e.id),
    actions: game.actions
      .filter((e) => camera.isInView(e.pos))
      .map((a) => a.id),
  } satisfies MapData;
};

const handlers: GameThreadUIHandler = {
  [UIMessageType.INITIALIZE]: (initialCam) => {
    const cam = determineInitialCameraPosition(initialCam);

    Object.assign(camera.c, cam);
    channel.postMessage({
      type: UIMessageType.MAP,
      data: { ...generateUIMapData(), camera: camera.c },
    });
  },
  [UIMessageType.QUERY]: (cam) => {
    Object.assign(camera.c, cam);
    channel.postMessage({
      type: UIMessageType.MAP,
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
      type: EntityType.GOLEM,
      pos: coord,
      runes: data.runes,
      id: id,
      speed: data.runes.find((r) => r[0] === Rune.WIND)?.[1] ?? 0,
      weight: Math.max(1, weight),
      minecapacity: [0, data.runes.find((r) => r[0] === Rune.VOID)?.[1] ?? 0],
      mineSpeed: data.runes.find((r) => r[0] === Rune.LABOR)?.[1] ?? 0,
    } satisfies GolemEntity;
    game.entities.push(golem);
    channel.postMessage({
      type: UIMessageType.ADD_ENTITY,
      data: golem.id,
    });

    launchGolem(id, data.incantation);
  },
  [UIMessageType.REFRESH_ENTITY]: (entityID) => {
    const entity = game.entities.find((e) => e.id === entityID)!;
    channel.postMessage({
      type: UIMessageType.UPDATE_ENTITY,
      data: entity,
    });
  },
  [UIMessageType.REFRESH_ACTION]: (actionID) => {
    const action = game.actions.find((e) => e.id === actionID)!;
    channel.postMessage({
      type: UIMessageType.UPDATE_ACTION,
      data: action,
    });
  },
};

channel.onmessage = ({ data }) => handlers[data.type]?.(data.data);

// Send to the main thread that the game is ready
new BroadcastChannel("READY").postMessage("");
