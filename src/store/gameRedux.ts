import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { game, Game } from "../Game/game";

export const runGameSelectors = (): void => {
  subscriptions.forEach((f) => f(game));
};

const subscriptions: ((g: Game) => void)[] = [];

const createUpdateFunction = <T>(
  f: (g: Game) => T,
  eq: ((a: T, b: T) => boolean) | undefined,
  setValue: Dispatch<SetStateAction<T>>
): ((g: Game) => void) => {
  if (eq === undefined) {
    return (g: Game): void => setValue(f(g));
  }

  return (g: Game): void => {
    setValue((previous) => {
      const next = f(g);
      return eq(previous, next) ? previous : next;
    });
  };
};

const subscribe = (check: (g: Game) => void): void => {
  subscriptions.push(check);
};

const unsubscribe = (check: (g: Game) => void) => {
  return (): void => {
    const i = subscriptions.findIndex((f) => f === check);
    if (i === -1) return;
    subscriptions.splice(i, 1);
  };
};

export const useGameSelector = <T>(
  f: (g: Game) => T,
  eq?: (a: T, b: T) => boolean
): T => {
  const [value, setValue] = useState(f(game));
  useEffect(() => {
    const check = createUpdateFunction(f, eq, setValue);
    subscribe(check);
    return unsubscribe(check);
  }, [f, eq]);
  return value;
};
