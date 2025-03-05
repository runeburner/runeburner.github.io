import React, { useRef, useState } from "react";
import classes from "./Pannable.module.css";
import { Vec } from "../../types/vec";

type PannableProps = React.PropsWithChildren<{
  onPan: (pos: Vec) => void;
}>;

export const Pannable = ({
  children,
  onPan,
}: PannableProps): React.ReactElement => {
  const [pos, setPos] = useState<Vec>([0, 0]);
  const isPanning = useRef(false);

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button == 1) isPanning.current = true;
  };
  const onMouseUp = (e: React.MouseEvent): void => {
    if (e.button === 1) isPanning.current = false;
  };

  const onMouseMove = (e: React.MouseEvent): void => {
    if (!isPanning.current) return;
    e.preventDefault();
    onPan([pos[0] + e.movementX, pos[1] + e.movementY]);
    setPos([pos[0] + e.movementX, pos[1] + e.movementY]);
  };

  const onMouseLeave = (): void => {
    isPanning.current = false;
  };

  return (
    <div
      className={"w-full h-full relative overflow-hidden " + classes.container}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className={"absolute"} style={{ left: pos[0], top: pos[1] }}>
        {children}
      </div>
    </div>
  );
};
