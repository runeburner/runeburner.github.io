export const leafPower = (n: number): number => {
  return 1 + 0.01 * n;
};

const donations = 230;

export const BloodRunePower = 1 + donations / 100 / 50;
