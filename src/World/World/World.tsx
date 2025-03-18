import { Pannable } from "../Pannable/Pannable";
import { AddGolem } from "../AddGolem/AddGolem";
import { Vec } from "../../types/vec";
import { Tiles } from "../Tiles";
import { useThrottledCallback } from "use-debounce";
import { Entities } from "../Entities";
import { camera, useCamera } from "./Camera";

export const World = (): React.ReactElement => {
  const cam = useCamera();

  const throttledSetCamera = useThrottledCallback((p) => {
    camera.setPos(p);
  }, 100);

  const onPan = ([x, y]: Vec): void => {
    throttledSetCamera([-Math.floor(x / 64), -Math.floor(y / 64)]);
  };

  return (
    <>
      <Pannable onPan={onPan}>
        <Tiles camera={cam} />
        <Entities />
      </Pannable>
      <AddGolem />
    </>
  );
};
