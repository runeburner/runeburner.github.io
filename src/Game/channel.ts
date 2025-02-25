import { EntityType, GolemEntity } from "../types/entity";
import {
  Camera,
  MapData,
  MessageHandlers,
  MessageType,
  UIChannel,
} from "../types/message";
import { actions, at, entities, map } from "./values";
import { ValuesPerTile } from "../types/map";
import { determineInitialCameraPosition } from "./values";
import { launchGolem } from "./launch_golem";
import { Tile } from "../types/tile";
import { Rune, RuneWeight } from "../types/rune";
import { Vec } from "../types/vec";

export const channel: UIChannel = new BroadcastChannel("UI");

// x, y, w, h
const camera = {
  pos: [0, 0],
  size: [0, 0],
} satisfies Camera;

export const isInView = (v: Vec): boolean => {
  return (
    camera.pos[0] <= v[0] &&
    v[0] < camera.pos[0] + camera.size[0] &&
    camera.pos[1] <= v[1] &&
    v[1] < camera.pos[1] + camera.size[1]
  );
};

export const findClosest = (pos: Vec, wantTile: Tile, radius: number): Vec => {
  const x = Math.max(0, pos[0] - Math.floor(radius / 2));
  const X = Math.min(map.width, pos[0] + Math.ceil(radius / 2));
  const y = Math.max(0, pos[1] - Math.floor(radius / 2));
  const Y = Math.min(map.height, pos[1] + Math.ceil(radius / 2));
  let closestTile: Vec = [-1, -1];
  let closestDist = 1e99;
  for (let j = y; j < Y; j++) {
    for (let i = x; i < X; i++) {
      const tile = at(i, j);
      if (tile[0] === wantTile) {
        const dist = Math.abs(pos[0] - i) + Math.abs(pos[1] - j);
        if (dist < closestDist) {
          closestTile = [i, j];
          closestDist = dist;
        }
      }
    }
  }
  return closestTile;
};

const generateMapData = () => {
  const x = Math.max(0, camera.pos[0]);
  const y = Math.max(0, camera.pos[1]);
  const X = Math.min(map.width, camera.pos[0] + camera.size[0]);
  const Y = Math.min(map.height, camera.pos[1] + camera.size[1]);
  const width = X - x;
  const height = Y - y;
  const data = new Int32Array(width * height * ValuesPerTile);
  for (let j = y; j < Y; j++) {
    const offset = (j - y) * width * ValuesPerTile;
    data.set(
      map.data.slice(
        (j * map.width + x) * ValuesPerTile,
        (j * map.width + X) * ValuesPerTile
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
    entities: entities.filter((e) => isInView(e.pos)).map((e) => e.id),
    actions: actions.filter((e) => isInView(e.pos)).map((a) => a.id),
  } satisfies MapData;
};

const uiMessageHandlers: MessageHandlers = {
  [MessageType.INITIALIZE]: (msg) => {
    const cam = determineInitialCameraPosition(msg.data);

    Object.assign(camera, cam);
    channel.postMessage({
      type: MessageType.MAP,
      data: { ...generateMapData(), camera: camera },
    });
  },
  [MessageType.QUERY]: (msg) => {
    Object.assign(camera, msg.data);
    channel.postMessage({
      type: MessageType.MAP,
      data: generateMapData(),
    });
  },
  [MessageType.ANIMATE]: (msg) => {
    const id = crypto.randomUUID();
    const weight = msg.data.runes.reduce(
      (weight, rune) => weight + RuneWeight[rune[0]] * rune[1],
      0
    );
    const golem = {
      type: EntityType.GOLEM,
      pos: [1, 1],
      runes: msg.data.runes,
      id: id,
      speed: msg.data.runes.find((r) => r[0] === Rune.WIND)?.[1] ?? 0,
      weight: Math.max(1, weight),
      minecapacity: [
        0,
        msg.data.runes.find((r) => r[0] === Rune.VOID)?.[1] ?? 0,
      ],
      mineSpeed: msg.data.runes.find((r) => r[0] === Rune.LABOR)?.[1] ?? 0,
    } satisfies GolemEntity;
    entities.push(golem);
    channel.postMessage({
      type: MessageType.ADD_ENTITY,
      data: golem.id,
    });

    launchGolem(id, msg.data.incantation);
  },
  [MessageType.REFRESH_ENTITY]: (msg) => {
    const entity = entities.find((e) => e.id === msg.data)!;
    channel.postMessage({
      type: MessageType.UPDATE_ENTITY,
      data: entity,
    });
  },
  [MessageType.REFRESH_ACTION]: (msg) => {
    const action = actions.find((e) => e.id === msg.data)!;
    channel.postMessage({
      type: MessageType.UPDATE_ACTION,
      data: action,
    });
  },
};

channel.onmessage = ({ data: msg }) => {
  const f = uiMessageHandlers[msg.type];
  if (!f) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  f(msg as any);
};

// Send to the main thread that the game is ready
new BroadcastChannel("READY").postMessage("");
