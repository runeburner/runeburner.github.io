const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

export const Smooth = (
  v: [number, number],
  target: number,
  smoothTime: number,
  maxSpeed: number,
  deltaTime: number
): void => {
  // Based on Game Programming Gems 4 Chapter 1.10
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;

  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = v[0] - target;
  const originalTo = target;

  // Clamp maximum speed
  const maxChange = maxSpeed * smoothTime;
  change = clamp(change, -maxChange, maxChange);
  target = v[0] - change;

  const temp = (v[1] + omega * change) * deltaTime;
  v[1] = (v[1] - omega * temp) * exp;
  let output = target + (change + temp) * exp;

  // Prevent overshooting
  if (originalTo - v[0] > 0.0 == output > originalTo) {
    output = originalTo;
    v[1] = (output - originalTo) / deltaTime;
  }

  v[0] = output;
};
