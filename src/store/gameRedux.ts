import { useEffect, useRef, useState } from "react";
import { game, Game } from "../Game/game";

const trieq = <T>(a: T, b: T): boolean => a === b;

export const runGameSelectors = (): void => {
  subscriptions.forEach((f) => f(game));
};

const subscriptions: ((g: Game) => void)[] = [];

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
  eq: (a: T, b: T) => boolean = trieq
): T => {
  const initial = f(game);
  const [value, setValue] = useState(initial);
  const ref = useRef(initial);
  useEffect(() => {
    const check = (g: Game): void => {
      const next = f(g);
      if (eq(ref.current, next)) return;
      ref.current = next;
      setValue(next);
    };
    subscribe(check);
    return unsubscribe(check);
  }, [f, eq]);
  return value;
};
