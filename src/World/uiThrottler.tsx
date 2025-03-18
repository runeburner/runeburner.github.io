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
    1000,
    {
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
  }, []);
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

let a = 0;
setInterval(() => {
  a++;
  m["A"]?.(a);
  uiUpdate();
}, 400);

let b = 0;
setInterval(() => {
  b++;
  m["B"]?.(Math.floor(b / 20));
  uiUpdate();
}, 200);

const Tester = ({ id }: { id: string }) => {
  const n = useIDThrottle(id);
  return <>{n}</>;
};

export const ThrottleTester = () => {
  return (
    <>
      <Tester id={"A"} />
      <Tester id={"B"} />
    </>
  );
};
