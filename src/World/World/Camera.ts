import { AABB } from "../../types/aabb";
import { Vec } from "../../types/vec";

const minPixelsPerTile = 12;
const maxPixelsPerTile = 512;

const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

export type Camera = {
  pos: Vec;
  size: Vec;
  scale: number;
};

export const isInView = (camera: Camera, v: Vec): boolean => {
  return (
    camera.pos[0] <= v[0] &&
    v[0] < camera.pos[0] + camera.size[0] &&
    camera.pos[1] <= v[1] &&
    v[1] < camera.pos[1] + camera.size[1]
  );
};

const scaleFactor = 1.1;
export const camera = {
  c: {
    pos: [0, 0],
    size: [24, 24],
    scale: 64,
  } as Camera,
  setPos(v: Vec): void {
    camera.c.pos = v;
  },
  setSize(v: Vec): void {
    camera.c.size = v;
  },
  fitToContext(ctx: CanvasRenderingContext2D): void {
    camera.c.size[0] = Math.floor(ctx.canvas.width) / camera.c.scale + 1;
    camera.c.size[1] = Math.floor(ctx.canvas.height) / camera.c.scale + 1;
  },
  zoom(iin: boolean, pos: Vec): void {
    const oldScale = camera.c.scale;
    camera.c.scale *= iin ? scaleFactor : 1 / scaleFactor;
    camera.c.scale = clamp(camera.c.scale, minPixelsPerTile, maxPixelsPerTile);
    const b0 = pos[0] / oldScale;
    const b1 = pos[1] / oldScale;
    const a0 = pos[0] / camera.c.scale;
    const a1 = pos[1] / camera.c.scale;
    camera.c.pos[0] += b0 - a0;
    camera.c.pos[1] += b1 - a1;
  },
  isInView(v: Vec): boolean {
    return (
      camera.c.pos[0] - 1 <= v[0] &&
      v[0] < camera.c.pos[0] + camera.c.size[0] &&
      camera.c.pos[1] - 1 <= v[1] &&
      v[1] < camera.c.pos[1] + camera.c.size[1]
    );
  },
  isAABBInView(v: AABB): boolean {
    return (
      camera.c.pos[0] <= v[0] &&
      v[0] + v[2] < camera.c.pos[0] + camera.c.size[0] &&
      camera.c.pos[1] <= v[1] &&
      v[1] + v[3] < camera.c.pos[1] + camera.c.size[1]
    );
  },
};
