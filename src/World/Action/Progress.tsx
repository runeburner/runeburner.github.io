import { useEffect, useState } from "react";
import { ActionProgress } from "../../types/actions";
import { game } from "../../Game/game";
import { eq } from "../../types/vec";

export const actionUpdateMap: Record<string, (a: ActionProgress) => void> = {};

export const useAction = (id: number): ActionProgress => {
  const [action, setAction] = useState<ActionProgress>(game.actionM[id]);
  useEffect(() => {
    actionUpdateMap[id] = setAction;
    return () => {
      delete actionUpdateMap[id];
    };
  }, [id]);
  return action;
};

export const progressUpdateMap: Record<string, (v: Vec) => void> = {};

export const useActionProgress = (id: number): Vec => {
  const [action, setAction] = useState<Vec>([
    ...(game.actionM[id]?.progress ?? [0, 0]),
  ]);
  useEffect(() => {
    progressUpdateMap[id] = (v): void => {
      if (eq(v, action)) return;
      setAction([...v]);
    };
    return () => {
      delete progressUpdateMap[id];
    };
  }, [id]);
  return action;
};

export const progressPosUpdateMap: Record<string, (v: Vec) => void> = {};

export const useActionProgressPos = (id: number): Vec => {
  const [action, setAction] = useState<Vec>(game.actionM[id]?.pos ?? [0, 0]);
  useEffect(() => {
    progressPosUpdateMap[id] = (v): void => {
      if (eq(v, action)) return;
      setAction(v);
    };
    return (): void => {
      delete progressPosUpdateMap[id];
    };
  }, [id]);
  return action;
};
