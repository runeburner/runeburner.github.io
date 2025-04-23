import { useEffect, useRef, useState } from "react";
import { game, Game } from "../Game/game";

const trieq = <T>(a: T, b: T): boolean => a === b;

export const runGameSelectors = (): void => {
  for (const sub of subscriptions) sub(game);
};

const subscriptions: ((g: Game) => void)[] = [];

const subscribe = (check: (g: Game) => void): void => {
  subscriptions.push(check);
};

const unsubscribe = (check: (g: Game) => void) => {
  return (): void => {
    let found = -1;
    for (let i = 0; i < subscriptions.length; i++) {
      if (subscriptions[i] !== check) continue;
      found = i;
      break;
    }
    if (found === -1) return;
    subscriptions[found] = subscriptions[subscriptions.length - 1];
    subscriptions.length -= 1;
  };
};

const incr = (n: number): number => n + 1;

export const useGameSelector = <T>(
  f: (g: Game) => T,
  eq: (a: T, b: T) => boolean = trieq
): T => {
  const [, setValue] = useState(0);
  const ref = useRef(f(game));
  useEffect(() => {
    const check = (g: Game): void => {
      const next = f(g);
      if (eq(ref.current, next)) return;
      ref.current = next;
      setValue(incr);
    };
    subscribe(check);
    return unsubscribe(check);
  }, [f, eq]);
  return ref.current;
};
