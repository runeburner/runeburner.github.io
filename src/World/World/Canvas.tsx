import { HTMLProps, useRef } from "react";
import { uiFPS } from "../uiFPS";
import { camera } from "./Camera";
import { renderWorld } from "./Render/Main";
import { useAtInterval } from "./useAtInterval";
import { useWindowResize } from "./useWindowResize";

export const Canvas = (
  props: HTMLProps<HTMLCanvasElement>
): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const isPanning = useRef(false);

  const onMouseDown = ({ button }: React.MouseEvent): boolean =>
    (isPanning.current ||= button === 1);

  const onMouseUp = ({ button }: React.MouseEvent): boolean =>
    (isPanning.current &&= button !== 1);

  const onMouseLeave = (): boolean => (isPanning.current = false);

  const onMouseMove = (e: React.MouseEvent): void => {
    if (!isPanning.current) return;
    e.preventDefault();
    camera.c.pos[0] -= e.movementX / camera.c.scale;
    camera.c.pos[1] -= e.movementY / camera.c.scale;
    const ctx = getContext(false);
    if (!ctx) return;
    renderWorld(ctx);
  };

  const onWheel = (e: React.WheelEvent): void => {
    const ctx = getContext(true);
    if (!ctx || !canvas.current) return;
    const pos: Vec = [
      e.clientX - canvas.current.offsetLeft,
      e.clientY - canvas.current.offsetTop,
    ];
    camera.zoom(e.deltaY > 0, pos);
    camera.fitToContext(ctx);
    renderWorld(ctx);
  };

  const getContext = (
    reframe: boolean
  ): CanvasRenderingContext2D | undefined => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    if (reframe) {
      ctx.canvas.width = canvas.current.clientWidth;
      ctx.canvas.height = canvas.current.clientHeight;
    }
    return ctx;
  };

  const onTick = (): (() => void) | undefined => {
    const ctx = getContext(true);
    if (!ctx) return;
    camera.fitToContext(ctx);
    renderWorld(ctx);
    return () => renderWorld(ctx);
  };
  useAtInterval(onTick, 1000 / uiFPS);

  const onResize = (): void => {
    const ctx = getContext(true);
    if (!ctx) return;
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
