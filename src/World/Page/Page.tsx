import { useRef } from "react";
import { Inspection } from "../Inspection/Inspection";
import { Canvas } from "../World/Canvas";
import { Zoom } from "../Zoom/Zoom";

export const Page = (): React.ReactElement => {
  const canvas = useRef<HTMLCanvasElement>(null);
  return (
    <div className="w-full h-full relative">
      <Zoom canvas={canvas} />

      <Inspection />
      <Canvas canvas={canvas} className="w-full h-full" />
    </div>
  );
};
