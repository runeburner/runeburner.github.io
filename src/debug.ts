export const GLOBAL_SPEED_UP = ((): number => {
  const f = parseFloat(localStorage.getItem("GLOBAL_SPEED_UP") ?? "1");
  if (isNaN(f)) return 1;
  if (f < 0) return 1;
  return f;
})();
