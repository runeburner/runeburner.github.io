type IDMaker = {
  next(): number;
  reset(): void;
};

export const ID = ((): IDMaker => {
  let v = 0;
  return {
    next(): number {
      return v++;
    },
    reset(): void {
      v = 0;
    },
  };
})();
