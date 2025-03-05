// of exactly 4
// minX, minY, maxX, maxY
export type AABB = Int32Array;

export const BoundedAABB = (bounds: AABB, pos: Vec, radius: number): AABB =>
  new Int32Array([
    Math.max(bounds[0], pos[0] - radius),
    Math.max(bounds[1], pos[1] - radius),
    Math.min(bounds[2], pos[0] + radius),
    Math.min(bounds[3], pos[1] + radius),
  ]);

export const RadiusAABB = (v: Vec, radius: number): AABB =>
  new Int32Array([v[0] - radius, v[1] - radius, v[0] + radius, v[1] + radius]);

export const AddAABB = (v0: AABB, v1: AABB): AABB =>
  new Int32Array([
    Math.max(v0[0], v1[0]),
    Math.max(v0[1], v1[1]),
    Math.min(v0[2], v1[2]),
    Math.min(v0[3], v1[3]),
  ]);
