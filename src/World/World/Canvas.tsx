import { HTMLProps, useRef } from "react";
import { uiFPS } from "../uiFPS";
import { camera } from "./Camera";
import { renderWorld } from "./Render/Main";
import { useAtInterval } from "./useAtInterval";
import { useWindowResize } from "./useWindowResize";
import { runGameSelectors } from "../../store/gameRedux";
import { game } from "../../Game/game";
import { Smooth } from "./smooth";

((): void => {
  const v: [number, number, number] = [0, 1, 0];
  const delay = 200;
  setInterval(() => {
    v[1] = 1 - v[1];
    console.log("switch");
  }, 3000);
  const smoothTimeSeconds = 1;
  setInterval(() => {
    Smooth(v, smoothTimeSeconds, 3000, delay / 1000);
    console.log(`${v[0].toFixed(2)} ${v[1].toFixed(2)} ${v[2].toFixed(2)}`);
  }, delay);
})();

export const Canvas = (
  props: HTMLProps<HTMLCanvasElement>
): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const isPanning = useRef(false);

  const reframe = ({ canvas }: CanvasRenderingContext2D): void => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  const onMouseDown = ({ button }: React.MouseEvent): boolean =>
    (isPanning.current ||= button === 1);

  const onMouseUp = ({ button }: React.MouseEvent): boolean =>
    (isPanning.current &&= button !== 1);

  const onMouseLeave = (): boolean => (isPanning.current = false);

  const onMouseMove = (e: React.MouseEvent): void => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    const p0 = camera.c.pos[0] - e.movementX / camera.c.scale;
    const p1 = camera.c.pos[1] - e.movementY / camera.c.scale;

    game.ui.inspectedTile = [
      Math.floor((e.clientX - ctx.canvas.offsetLeft) / camera.c.scale + p0),
      Math.floor((e.clientY - ctx.canvas.offsetTop) / camera.c.scale + p1),
    ];
    runGameSelectors();

    if (!isPanning.current) return;
    camera.c.pos[0] = p0;
    camera.c.pos[1] = p1;
    renderWorld(ctx);
  };

  const onWheel = (e: React.WheelEvent): void => {
    if (e.deltaY === 0) return;
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !canvas.current) return;
    reframe(ctx);
    const pos: Vec = [
      e.clientX - canvas.current.offsetLeft,
      e.clientY - canvas.current.offsetTop,
    ];
    camera.zoom(e.deltaY < 0, pos);
    camera.fitToContext(ctx);
    renderWorld(ctx);
  };

  const onTick = (): (() => void) | undefined => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    reframe(ctx);
    return () => renderWorld(ctx);
  };
  useAtInterval(onTick, 1000 / uiFPS);

  const onResize = (): void => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    reframe(ctx);
    camera.fitToContext(ctx);
    renderWorld(ctx);
  };
  useWindowResize(onResize);

  return (
    <canvas
      ref={canvas}
      {...props}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
    />
  );
};
