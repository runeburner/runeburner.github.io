import { Camera } from "../types/uiMessages";
import { Vec } from "../types/vec";

export const camera = {
  c: {
    pos: [0, 0],
    size: [0, 0],
  } satisfies Camera,
  isInView(v: Vec): boolean {
    return (
      this.c.pos[0] <= v[0] &&
      v[0] < this.c.pos[0] + this.c.size[0] &&
      this.c.pos[1] <= v[1] &&
      v[1] < this.c.pos[1] + this.c.size[1]
    );
  },
};
