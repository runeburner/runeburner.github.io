import { useEffect, useRef } from "react";
import { AddGolem } from "../AddGolem/AddGolem";
import { camera } from "./Camera";
import { renderTiles } from "./CanvasTile";
import { renderEntities } from "./CanvasEntities";
import { useThrottledCallback } from "use-debounce";
import { uiFPS } from "../uiThrottler";

export const World = (): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pos = useRef<Vec>([0, 0]);
  const isPanning = useRef(false);

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button == 1) isPanning.current = true;
  };
  const onMouseUp = (e: React.MouseEvent): void => {
    if (e.button === 1) isPanning.current = false;
  };

  const onMouseMove = (e: React.MouseEvent): void => {
    if (!isPanning.current) return;
    e.preventDefault();
    onPan([pos.current[0] + e.movementX, pos.current[1] + e.movementY]);
    pos.current = [pos.current[0] + e.movementX, pos.current[1] + e.movementY];
  };

  const onMouseLeave = (): void => {
    isPanning.current = false;
  };

  const getContext = (): CanvasRenderingContext2D | undefined => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.canvas.width = canvas.current.clientWidth;
    ctx.canvas.height = canvas.current.clientHeight;
    return ctx;
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const transform = ctx.getTransform();
    ctx.translate(pos.current[0] - transform.e, pos.current[1] - transform.f);
    renderTiles(ctx);
    renderEntities(ctx);
  };

  useEffect(() => {
    const ctx = getContext();
    if (!ctx) return;

    camera.setSize([
      Math.floor(ctx.canvas.width / 64) + 1,
      Math.floor(ctx.canvas.height / 64) + 1,
    ]);

    const id = setInterval(() => render(ctx), 1000 / uiFPS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const ctx = getContext();
      if (!ctx) return;
      render(ctx);
      camera.setSize([
        Math.floor(ctx.canvas.width / 64),
        Math.floor(ctx.canvas.height / 64),
      ]);
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPan = ([x, y]: Vec): void => {
    camera.setPos([-x / 64, -y / 64]);
  };

  return (
    <>
      <canvas
        ref={canvas}
        width={"100%"}
        height={"100%"}
        className="w-full h-full"
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      <AddGolem />
    </>
  );
};
