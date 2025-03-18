import { game } from "../../Game/game";
import { eq } from "../../types/vec";
import { makeThrottledUse } from "../uiThrottler";

export const [actionUpdateMap, useAction] = makeThrottledUse(
  (id) => game.actionM[id]
);

export const [progressUpdateMap, useActionProgress] = makeThrottledUse(
  (id) => game.actionM[id]?.progress ?? [0, 0],
  eq,
  (a): Vec => [...a]
);

export const [progressPosUpdateMap, useActionProgressPos] = makeThrottledUse(
  (id) => game.actionM[id]?.pos ?? [0, 0],
  eq,
  (a): Vec => [...a]
);
