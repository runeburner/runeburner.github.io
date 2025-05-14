const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

export const Smooth = (
  v: [number, number, number],
  smoothTimeSec: number,
  maxSpeed: number,
  deltaTimeSec: number
): void => {
  smoothTimeSec = Math.max(0.0001, smoothTimeSec);
  const num = 2 / smoothTimeSec;
  const num2 = num * deltaTimeSec;
  const num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
  let num4 = v[0] - v[1];
  const num5 = v[1];
  const num6 = maxSpeed * smoothTimeSec;
  num4 = clamp(num4, -num6, num6);
  v[1] = v[0] - num4;
  const num7 = (v[2] + num * num4) * deltaTimeSec;
  v[2] = (v[2] - num * num7) * num3;
  let num8 = v[1] + (num4 + num7) * num3;
  if (num5 - v[0] > 0 == num8 > num5) {
    num8 = num5;
    v[2] = (num8 - num5) / deltaTimeSec;
  }
  v[0] = num8;
};
