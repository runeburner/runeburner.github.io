import { useEffect, useRef } from "react";
import { AddGolem } from "../AddGolem/AddGolem";
import { camera } from "./Camera";
import { renderTiles } from "./CanvasTile";
import { renderEntities } from "./CanvasEntities";
import { uiFPS } from "../uiThrottler";

export const World = (): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pos = useRef<Vec>([0, 0]);
  const isPanning = useRef(false);

  const onPan = ([x, y]: Vec): void => {
    camera.setPos([-x / 64, -y / 64]);
  };

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button === 1) isPanning.current = true;
  };
  const onMouseUp = (e: React.MouseEvent): void => {
    if (e.button === 1) isPanning.current = false;
  };

  const onMouseMove = (e: React.MouseEvent): void => {
    if (!isPanning.current) return;
    e.preventDefault();
    const v: Vec = [
      Math.min(64, pos.current[0] + e.movementX),
      Math.min(64, pos.current[1] + e.movementY),
    ];
    onPan(v);
    pos.current = v;
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

  const render = (ctx: CanvasRenderingContext2D): void => {
    const transform = ctx.getTransform();
    ctx.translate(pos.current[0] - transform.e, pos.current[1] - transform.f);
    ctx.clearRect(
      -pos.current[0],
      -pos.current[1],
      ctx.canvas.width,
      ctx.canvas.height
    );
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
    return (): void => clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = (): void => {
      const ctx = getContext();
      if (!ctx) return;
      render(ctx);
      camera.setSize([
        Math.floor(ctx.canvas.width / 64),
        Math.floor(ctx.canvas.height / 64),
      ]);
    };

    window.addEventListener("resize", onResize);

    return (): void => window.removeEventListener("resize", onResize);
  }, []);

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
