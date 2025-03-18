import { useEffect, useState } from "react";
import { game } from "../Game/game";
import { Camera } from "../types/uiMessages";
import { Tile } from "./Tile/Tile";
import { useThrottledCallback } from "use-debounce";

type TilesProps = {
  camera: Camera;
};

export let tilesUpdate: (() => void) | null = null;

export const useTilesUpdate = (): void => {
  const [, setV] = useState(0);

  const onUpdate = useThrottledCallback(() => setV((v) => v + 1), 100);
  useEffect(() => {
    tilesUpdate = onUpdate;
    return () => {
      tilesUpdate = null;
    };
  }, []);
};

export const Tiles = ({ camera }: TilesProps) => {
  useTilesUpdate();
  const x = Math.max(0, camera.pos[0]);
  const y = Math.max(0, camera.pos[1]);
  const X = Math.min(game.map.bounds[2], camera.pos[0] + camera.size[0]);
  const Y = Math.min(game.map.bounds[3], camera.pos[1] + camera.size[1]);
  const tiles: JSX.Element[] = [];
  for (let j = y; j < Y; j++) {
    for (let i = x; i < X; i++) {
      tiles.push(<Tile key={`${i}_${j}`} x={i} y={j} />);
    }
  }

  return <>{tiles}</>;
};
