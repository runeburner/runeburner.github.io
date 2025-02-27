import { EntityType } from "../types/entity";
import { Camera } from "../types/uiMessages";
import { game } from "./game";

export const waitingActionMap: Record<string, (v: unknown) => void> = {};

export const determineInitialCameraPosition = (cam: Camera): Camera => {
  const core = game.entities.find((e) => e.type === EntityType.HEART);
  return {
    pos: [
      (core?.pos[0] ?? 0) - Math.floor(cam.size[0] / 2),
      (core?.pos[1] ?? 0) - Math.floor(cam.size[1] / 2),
    ],
    size: [...cam.size],
  };
};
