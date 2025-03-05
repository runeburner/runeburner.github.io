import { useEffect, useState } from "react";
import { AABB } from "../../types/aabb";
import { Camera } from "../../types/uiMessages";
import { Vec } from "../../types/vec";
import { Entity } from "../../types/entity";

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
  } satisfies Camera,
  setPos(v: Vec): void {
    this.c.pos = v;
    if (camSub) {
      camSub();
    }
  },
  setSize(v: Vec): void {
    this.c.size = v;
    if (camSub) camSub();
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
  onAddEntity(e: Entity): void {
    if (!this.isInView(e.pos)) return;
    visiblebleEntities.push(e);
    visibleEntitiesSub?.();
  },
};

let camSub: (() => void) | null = null;

export const useCamera = (): Camera => {
  const [, setN] = useState(0);
  useEffect(() => {
    camSub = () => setN((n) => n + 1);
    return () => {
      camSub = null;
    };
  }, [setN]);
  return camera.c;
};

export const visiblebleEntities: Entity[] = [];
export let visibleEntitiesSub: (() => void) | null = null;

export const useVisibleEntities = (): Entity[] => {
  const [, setN] = useState(0);
  useEffect(() => {
    visibleEntitiesSub = () => setN((n) => n + 1);
    return () => {
      visibleEntitiesSub = null;
    };
  }, [setN]);
  return visiblebleEntities;
};
