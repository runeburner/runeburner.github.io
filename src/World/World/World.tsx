import { useEffect, useRef } from "react";
import { AddGolem } from "../AddGolem/AddGolem";
import { camera } from "./Camera";
import { renderTiles } from "./Render/Tile";
import { renderEntities } from "./Render/Entities";
import { uiFPS } from "../uiFPS";

let scale = 64;
export const World = (): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pos = useRef<Vec>([0, 0]);
  const isPanning = useRef(false);

  const onPan = ([x, y]: Vec): void => {
    camera.setPos([-x, -y]);
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
      Math.min(1, pos.current[0] + e.movementX / scale),
      Math.min(1, pos.current[1] + e.movementY / scale),
    ];
    onPan(v);
    pos.current = v;
  };

  const onMouseLeave = (): void => {
    isPanning.current = false;
  };

  const onWheel = (ev: React.WheelEvent): void => {
    if (ev.deltaY > 0) {
      scale *= 1.1;
    } else {
      scale /= 1.1;
    }
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
    transform.e = pos.current[0] * scale;
    transform.f = pos.current[1] * scale;
    transform.a = scale;
    transform.d = scale;
    ctx.setTransform(transform);
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
      Math.floor(ctx.canvas.width) + 1,
      Math.floor(ctx.canvas.height) + 1,
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
        Math.floor(ctx.canvas.width),
        Math.floor(ctx.canvas.height),
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
        onWheel={onWheel}
      />
      <AddGolem />
    </>
  );
};
