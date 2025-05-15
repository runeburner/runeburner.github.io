import { AABB } from "../../types/aabb";
import { Vec } from "../../types/vec";
import { uiFPS } from "../uiFPS";
import { Smooth } from "./smooth";

export type Camera = {
  pos: Vec;
  size: Vec;
  scale: [number, number];
  targetScale: number;
  scalePos: Vec;
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
    scale: [64, 0] as [number, number],
    targetScale: 64,
    scalePos: [0, 0],
  },
  setPos(v: Vec): void {
    camera.c.pos = v;
  },
  setSize(v: Vec): void {
    camera.c.size = v;
  },
  fitToContext(ctx: CanvasRenderingContext2D): void {
    camera.c.size[0] = Math.floor(ctx.canvas.width) / camera.c.scale[0] + 1;
    camera.c.size[1] = Math.floor(ctx.canvas.height) / camera.c.scale[0] + 1;
  },
  zoom(iin: boolean, pos: Vec): void {
    camera.c.targetScale *= iin ? scaleFactor : 1 / scaleFactor;
    camera.c.scalePos = pos;
  },
  smoothZoom(deltaTimeSec: number): void {
    const oldScale = camera.c.scale[0];
    Smooth(camera.c.scale, camera.c.targetScale, 1 / uiFPS, 100, deltaTimeSec);
    const a0 = camera.c.scalePos[0] / camera.c.scale[0];
    const a1 = camera.c.scalePos[1] / camera.c.scale[0];
    const b0 = camera.c.scalePos[0] / oldScale;
    const b1 = camera.c.scalePos[1] / oldScale;
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
