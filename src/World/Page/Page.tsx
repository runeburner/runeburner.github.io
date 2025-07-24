import { useRef } from "react";
import { Inspection } from "../Inspection/Inspection";
import { Canvas } from "../World/Canvas";
import { Zoom } from "../Zoom/Zoom";
import { useGameSelector } from "../../store/gameRedux";
import { useTranslation } from "react-i18next";

export const Page = (): React.ReactElement => {
  const hasWorld = useGameSelector((g) => g.plane.bounds[2] > 0);
  const { t } = useTranslation();
  if (!hasWorld) {
    return (
      <div className="w-full h-full relative p-4">
        <p>{t("world.theworldisempty")}</p>
      </div>
    );
  }
  const canvas = useRef<HTMLCanvasElement>(null);
  return (
    <div className="w-full h-full relative">
      <Zoom canvas={canvas} />

      <Inspection />
      <Canvas canvas={canvas} className="w-full h-full" />
    </div>
  );
};
