import { useEffect } from "react";

export const useAtInterval = (
  fn: () => (() => void) | undefined,
  rate: number
): void => {
  useEffect(() => {
    const f = fn();
    const id = setInterval(() => f, rate);
    return (): void => clearInterval(id);
  }, [fn, rate]);
};
