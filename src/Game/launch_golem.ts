import { MessageType } from "../types/message";
import { Tile } from "../types/tile";
import { channel, findClosest } from "./channel";
import { actions, aStarPath, entities } from "./values";
import workerScriptHeader from "./workerScriptHeader.js?raw";

export const launchGolem = (id: string, incantation: string) => {
  const o = URL.createObjectURL(
    new Blob([workerScriptHeader + incantation], {
      type: "application/javascript",
    })
  );

  const worker = new Worker(new URL(o, import.meta.url), {
    name: id,
  });
  worker.onmessage = (m) => {
    if (m.data.command === "WORKER_READY") {
      navigator.locks
        .request(id, () => {})
        .then(() => {
          console.log("DEATH");
        });
      worker.postMessage({
        workerID: m.data.workerID,
        requestID: m.data.requestID,
      });
    }
    if (m.data.command === "findClosestTile") {
      const tileType = m.data.args[0] as string;
      const radius = m.data.args[1] as number;

      const golem = entities.find((e) => e.id === id)!;
      const pos: [number, number] = [golem.x, golem.y];

      worker.postMessage({
        workerID: m.data.workerID,
        requestID: m.data.requestID,
        data: findClosest(
          pos,
          Object.entries(Tile).find((t) => t[0] === tileType)![1],
          radius
        ),
      });
    }
    if (m.data.command === "goNextTo") {
      const golem = entities.find((e) => e.id === id)!;
      const path = aStarPath([golem.x, golem.y], m.data.args[0]);
      if (path == null) {
        worker.postMessage({
          workerID: m.data.workerID,
          requestID: m.data.requestID,
          data: null,
        });
        return;
      }
      path.pop();
      const action = {
        id: crypto.randomUUID(),
        entityID: golem.id,
        path: path,
      };
      actions.push(action);
      worker.postMessage({
        workerID: m.data.workerID,
        requestID: m.data.requestID,
        data: "OK",
      });
      channel.postMessage({
        type: MessageType.ADD_ACTION,
        data: action,
      });
    }
    if (m.data.command === "ping") {
      worker.postMessage({
        workerID: m.data.workerID,
        requestID: m.data.requestID,
        data: "pong",
      });
    }
  };
  worker.onerror = console.log;
  worker.onmessageerror = console.log;
};
