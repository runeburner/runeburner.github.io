import { useCallback, useEffect, useRef } from "react";
import { AddGolem } from "../AddGolem/AddGolem";
import { camera } from "./Camera";
import { renderTiles } from "./Render/Tile";
import { renderEntities } from "./Render/Entities";
import { uiFPS } from "../uiFPS";
import { game } from "../../Game/game";

const scaleFactor = 1.1;
export const World = (): React.ReactElement => {
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
  };

  const onWheel = (e: React.WheelEvent): void => {
    const ctx = getContext();
    if (!ctx || !canvas.current) return;
    const oldScale = camera.c.scale;
    camera.c.scale *= e.deltaY > 0 ? scaleFactor : 1 / scaleFactor;
    const p0 = e.clientX - canvas.current.offsetLeft;
    const p1 = e.clientY - canvas.current.offsetTop;
    const b0 = p0 / oldScale;
    const b1 = p1 / oldScale;
    const a0 = p0 / camera.c.scale;
    const a1 = p1 / camera.c.scale;
    camera.c.pos[0] += b0 - a0;
    camera.c.pos[1] += b1 - a1;

    resize(ctx);
    render(ctx);
  };

  const getContext = (): CanvasRenderingContext2D | undefined => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.canvas.width = canvas.current.clientWidth;
    ctx.canvas.height = canvas.current.clientHeight;
    return ctx;
  };

  const clear = (ctx: CanvasRenderingContext2D): void => {
    const transform = ctx.getTransform();
    transform.e = -camera.c.pos[0] * camera.c.scale;
    transform.f = -camera.c.pos[1] * camera.c.scale;
    transform.a = camera.c.scale;
    transform.d = camera.c.scale;
    ctx.setTransform(transform);
    ctx.clearRect(
      camera.c.pos[0],
      camera.c.pos[1],
      ctx.canvas.width,
      ctx.canvas.height
    );
  };

  const render = useCallback((ctx: CanvasRenderingContext2D): void => {
    clear(ctx);
    ctx.strokeStyle = "#ffffffff";
    ctx.lineWidth = 4 / 64;
    ctx.strokeRect(
      game.map.bounds[0],
      game.map.bounds[1],
      game.map.bounds[2],
      game.map.bounds[3]
    );
    renderTiles(ctx);
    renderEntities(ctx);
  }, []);

  const resize = (ctx: CanvasRenderingContext2D): void => {
    camera.c.size[0] = Math.floor(ctx.canvas.width) / camera.c.scale + 1;
    camera.c.size[1] = Math.floor(ctx.canvas.height) / camera.c.scale + 1;
  };

  // launch render loop
  useEffect(() => {
    const ctx = getContext();
    if (!ctx) return;

    resize(ctx);

    const id = setInterval(() => render(ctx), 1000 / uiFPS);
    return (): void => clearInterval(id);
  }, [render]);

  useEffect(() => {
    const onResize = (): void => {
      const ctx = getContext();
      if (!ctx) return;
      resize(ctx);
      render(ctx);
    };

    window.addEventListener("resize", onResize);

    return (): void => window.removeEventListener("resize", onResize);
  }, [render]);

  return (
    <>
      <canvas
        ref={canvas}
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
