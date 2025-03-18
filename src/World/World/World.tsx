import { useEffect, useRef } from "react";
import { AddGolem } from "../AddGolem/AddGolem";
import { useCamera } from "./Camera";
import { renderTiles } from "./CanvasTile";
import { renderEntities } from "./CanvasEntities";

export const World = (): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const cam = useCamera();
  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    ctx.canvas.width = canvas.current.clientWidth;
    ctx.canvas.height = canvas.current.clientHeight;

    const id = setInterval(() => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      renderTiles(ctx, cam);
      renderEntities(ctx);
    }, 500);
    return () => clearInterval(id);
  }, []);

  // const throttledSetCamera = useThrottledCallback((p) => {
  //   camera.setPos(p);
  // }, 100);

  // const onPan = ([x, y]: Vec): void => {
  //   throttledSetCamera([-Math.floor(x / 64), -Math.floor(y / 64)]);
  // };

  return (
    <>
      <canvas
        ref={canvas}
        width={"100%"}
        height={"100%"}
        className="w-full h-full"
      />
      <AddGolem />
    </>
  );
};
