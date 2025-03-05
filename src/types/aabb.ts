// of exactly 4
// minX, minY, maxX, maxY
export type AABB = Int32Array;

export const MapBoundedAABB = (bounds: AABB, pos: Vec, radius: number): AABB =>
  new Int32Array([
    Math.max(bounds[0], pos[0] - radius),
    Math.max(bounds[1], pos[1] - radius),
    Math.min(bounds[2], pos[0] + radius),
    Math.min(bounds[3], pos[1] + radius),
  ]);
