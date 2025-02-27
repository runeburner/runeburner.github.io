export const ID = (() => {
  let v = 0;
  return {
    next(): number {
      return v++;
    },
  };
})();
