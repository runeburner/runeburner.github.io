import { useEffect, useRef, useState } from "react";
import { DebouncedState, useThrottledCallback } from "use-debounce";

const emptyUpdate = (() => {
  const f = () => undefined;
  f.cancel = () => undefined;
  f.flush = () => undefined;
  f.isPending = () => false;
  return f;
})();
export let uiUpdate: DebouncedState<() => void> = emptyUpdate;

let throttleCallbackN = 0;
const throttleCallback: Record<number, () => void> = {};

export const useUIThrottle = (callback: () => void) => {
  const f = useThrottledCallback(
    () => {
      for (const f of Object.values(throttleCallback)) f();
    },
    1000 / 15,
    {
      leading: true,
      trailing: true,
    }
  );
  useEffect(() => {
    uiUpdate = f;
    throttleCallbackN++;
    const n = throttleCallbackN;
    throttleCallback[n] = callback;
    return () => {
      uiUpdate = emptyUpdate;
      delete throttleCallback[n];
    };
  }, [callback]);
};

let m: Record<string, (v: number) => void> = {};

export const useIDThrottle = (i: string) => {
  const ref = useRef(0);
  const [n, setN] = useState(0);
  useUIThrottle(() => {
    if (ref.current === n) return;
    setN(ref.current);
  });
  useEffect(() => {
    m[i] = (v) => (ref.current = v);
  }, []);
  return n;
};

export const makeThrottledUse = <T,>(
  defaultValue: (id: number) => T,
  eq: (a: T, b: T) => boolean = (a: T, b: T) => a === b,
  clone: (a: T) => T = (a) => a
): [Record<string, (e: T) => void>, (id: number) => T] => {
  const record: Record<string, (e: T) => void> = {};

  const useF = (id: number): T => {
    const def = clone(defaultValue(id));
    const ref = useRef<T>(def);
    const [pos, setPos] = useState<T>(def);
    useUIThrottle(() => {
      if (eq(ref.current, pos)) return;
      setPos(clone(ref.current));
    });

    useEffect(() => {
      record[id] = (p) => {
        ref.current = p;
        uiUpdate();
      };
      return () => {
        delete record[id];
      };
    }, [id]);
    return pos;
  };
  return [record, useF];
};
