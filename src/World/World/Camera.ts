import { AABB } from "../../types/aabb";
import { Vec } from "../../types/vec";

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

export const camera = {
  c: {
    pos: [0, 0],
    size: [24, 24],
    scale: 64,
  } satisfies Camera,
  setPos(v: Vec): void {
    this.c.pos = v;
  },
  setSize(v: Vec): void {
    this.c.size = v;
  },
  isInView(v: Vec): boolean {
    return (
      this.c.pos[0] <= v[0] &&
      v[0] < this.c.pos[0] + this.c.size[0] &&
      this.c.pos[1] <= v[1] &&
      v[1] < this.c.pos[1] + this.c.size[1]
    );
  },
  isAABBInView(v: AABB): boolean {
    return (
      this.c.pos[0] <= v[0] &&
      v[0] + v[2] < this.c.pos[0] + this.c.size[0] &&
      this.c.pos[1] <= v[1] &&
      v[1] + v[3] < this.c.pos[1] + this.c.size[1]
    );
  },
};
