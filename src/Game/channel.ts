import { EntityType } from "../types/entity";
import { MessageType, UIChannel } from "../types/message";
import { actions, at, entities, map } from "./values";
import { ValuesPerTile } from "../types/map";
import { determineInitialCameraPosition } from "./values";
import { launchGolem } from "./launch_golem";
import { Tile } from "../types/tile";

export const channel: UIChannel = new BroadcastChannel("UI");

// x, y, w, h
const camera = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
};

export const findClosest = (
  pos: [number, number],
  wantTile: Tile,
  radius: number
): [number, number] => {
  const x = Math.max(0, pos[0] - Math.floor(radius / 2));
  const X = Math.min(map.width, pos[0] + Math.ceil(radius / 2));
  const y = Math.max(0, pos[1] - Math.floor(radius / 2));
  const Y = Math.min(map.height, pos[1] + Math.ceil(radius / 2));
  let closestTile: [number, number] = [-1, -1];
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
  const x = Math.max(0, camera.x);
  const y = Math.max(0, camera.y);
  const X = Math.min(map.width, camera.x + camera.width);
  const Y = Math.min(map.height, camera.y + camera.height);
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
    x,
    y,
    map: {
      width,
      height,
      data,
    },
    entities: entities.filter(
      (e) =>
        camera.x <= e.x &&
        e.x <= camera.x + camera.width &&
        camera.y <= e.y &&
        e.y <= camera.y + camera.height
    ),
    actions: actions
      .filter(
        (e) =>
          camera.x <= e.path[0][0] &&
          e.path[0][0] <= camera.x + camera.width &&
          camera.y <= e.path[0][1] &&
          e.path[0][1] <= camera.y + camera.height
      )
      .map((a) => a.id),
  };
};

channel.onmessage = ({ data: msg }) => {
  switch (msg.type) {
    case MessageType.INITIALIZE: {
      const cam = determineInitialCameraPosition(msg.data);

      Object.assign(camera, cam);
      channel.postMessage({
        type: MessageType.MAP,
        data: { ...generateMapData(), camera: camera },
      });
      break;
    }
    case MessageType.QUERY: {
      Object.assign(camera, msg.data);
      channel.postMessage({
        type: MessageType.MAP,
        data: { ...generateMapData() },
      });
      break;
    }
    case MessageType.ANIMATE: {
      const id = crypto.randomUUID();
      const golem = {
        type: EntityType.GOLEM,
        x: 1,
        y: 1,
        runes: msg.data.runes,
        id: id,
      };

      entities.push(golem);
      channel.postMessage({
        type: MessageType.ADD_ENTITY,
        data: golem,
      });

      launchGolem(id, msg.data.incantation);
    }
  }
};

// Send to the main thread that the game is ready
new BroadcastChannel("READY").postMessage("");
