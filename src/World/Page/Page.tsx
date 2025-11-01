import { useRef } from "react";
import { Inspection } from "../Inspection/Inspection";
import { Canvas } from "../World/Canvas";
import { Zoom } from "../Zoom/Zoom";
import { useGameSelector } from "../../store/gameRedux";
import { useTranslation } from "react-i18next";
import { Goal } from "../Goal/Goal";
import { Game } from "../../Game/game";
import { TimeControls } from "../TimeControls/TimeControl";

const selectIsInRealm = (g: Game): boolean => !!g.realmId;

export const Page = (): React.ReactElement => {
  const hasWorld = useGameSelector(selectIsInRealm);
  const { t } = useTranslation();
  const canvas = useRef<HTMLCanvasElement>(null);
  if (!hasWorld) {
    return (
      <div className="w-full h-full relative p-4">
        <p>{t("world.theworldisempty")}</p>
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <Zoom canvas={canvas} />
      <TimeControls />

      <Inspection />
      <Canvas canvas={canvas} className="w-full h-full" />
      <Goal />
    </div>
  );
};
