import { useEffect, useRef } from "react";
import { AddGolem } from "../AddGolem/AddGolem";
import { camera } from "./Camera";
import { renderTiles } from "./Render/Tile";
import { renderEntities } from "./Render/Entities";
import { uiFPS } from "../uiFPS";

export const World = (): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const isPanning = useRef(false);

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
      Math.min(1, camera.c.pos[0] + e.movementX / camera.c.scale),
      Math.min(1, camera.c.pos[1] + e.movementY / camera.c.scale),
    ];
    camera.c.pos = v;
  };

  const onMouseLeave = (): void => {
    isPanning.current = false;
  };

  const onWheel = (ev: React.WheelEvent): void => {
    if (ev.deltaY > 0) {
      camera.c.scale *= 1.1;
    } else {
      camera.c.scale /= 1.1;
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
    transform.e = camera.c.pos[0] * camera.c.scale;
    transform.f = camera.c.pos[1] * camera.c.scale;
    transform.a = camera.c.scale;
    transform.d = camera.c.scale;
    ctx.setTransform(transform);
    ctx.clearRect(
      -camera.c.pos[0],
      -camera.c.pos[1],
      ctx.canvas.width,
      ctx.canvas.height
    );
    renderTiles(ctx);
    renderEntities(ctx);
  };

  useEffect(() => {
    const ctx = getContext();
    if (!ctx) return;

    const size: Vec = [
      Math.floor(ctx.canvas.width) / camera.c.scale + 1,
      Math.floor(ctx.canvas.height) / camera.c.scale + 1,
    ];
    camera.setSize(size);

    const id = setInterval(() => render(ctx), 1000 / uiFPS);
    return (): void => clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = (): void => {
      const ctx = getContext();
      if (!ctx) return;
      render(ctx);

      const size: Vec = [
        Math.floor(ctx.canvas.width) / camera.c.scale + 1,
        Math.floor(ctx.canvas.height) / camera.c.scale + 1,
      ];
      camera.setSize(size);
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
