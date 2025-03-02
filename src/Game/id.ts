type IDMaker = {
  next(): number;
};

export const ID = ((): IDMaker => {
  let v = 0;
  return {
    next(): number {
      return v++;
    },
  };
})();
