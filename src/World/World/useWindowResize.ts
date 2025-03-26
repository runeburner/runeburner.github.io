import { EffectCallback, useEffect } from "react";

const resizeEvent = "resize";
export const useWindowResize = (effect: EffectCallback): void => {
  const f = () => {
    window.addEventListener(resizeEvent, effect);
    return (): void => window.removeEventListener(resizeEvent, effect);
  };
  useEffect(f, [effect]);
};
