import { game } from "../../Game/game";
import { ActionType } from "../../types/actions";
import { Vec } from "../../types/vec";
import { uiFPS } from "../uiFPS";
import { camera } from "./Camera";

export type SpecialEffect = {
  pos: Vec;
  color: string;
  life: number;
  dir: Vec;
};

let activeEffects: SpecialEffect[] = [];

const ingestUIEvents = (): void => {
  for (const eff of game.ui.events) {
    if (eff.actionType === ActionType.MINE) {
      const speed = 0.05;
      activeEffects.push({
        pos: [...eff.pos],
        color: "#4a698c",
        life: 1000,
        dir: [
          Math.random() * speed - speed / 2,
          Math.random() * speed - speed / 2,
        ],
      });
    }
  }
  game.ui.events = [];
};

export const renderSpecialEffects = (ctx: CanvasRenderingContext2D): void => {
  const t = 1000 / uiFPS;
  ingestUIEvents();
  for (const eff of activeEffects) {
    const scale = 0.05;
    const transform = ctx.getTransform();
    const subtr = ctx.getTransform();
    subtr.e = (eff.pos[0] - camera.c.pos[0] + scale / 2 + 0.5) * camera.c.scale;
    subtr.f = (eff.pos[1] - camera.c.pos[1] + scale / 2) * camera.c.scale;
    subtr.a = camera.c.scale * scale;
    subtr.d = camera.c.scale * scale;
    ctx.setTransform(subtr);
    ctx.fillStyle = eff.color;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(-0.5, -0.5, 1, 1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.setTransform(transform);
    eff.pos[0] += eff.dir[0];
    eff.pos[1] += eff.dir[1];
    eff.life -= t;
  }
  activeEffects = activeEffects.filter((e) => e.life > 0);
};
