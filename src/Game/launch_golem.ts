import { ActionType, MoveAction } from "../types/actions";
import { GolemEntity } from "../types/entity";
import { MessageType } from "../types/message";
import { Tile } from "../types/tile";
import { channel, findClosest, isInView } from "./channel";
import { actions, aStarPath, entities, waitingActionMap } from "./values";
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
        type: ActionType.GOLEM_MOVE,
        id: crypto.randomUUID(),
        entityID: golem.id,
        path: path,
        x: path[0][0],
        y: path[0][1],
        progress: [0, (golem as GolemEntity).weight],
      } satisfies MoveAction;
      actions.push(action);
      waitingActionMap[action.id] = (v: unknown) => {
        worker.postMessage({
          workerID: m.data.workerID,
          requestID: m.data.requestID,
          data: v,
        });
      };
      if (isInView(action.x, action.y)) {
        channel.postMessage({
          type: MessageType.ADD_ACTION,
          data: action.id,
        });
      }
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
