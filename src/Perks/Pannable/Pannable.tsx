import React, { useRef, useState } from "react";
import classes from "./Pannable.module.css";
import { Vec } from "../../types/vec";

type PannableProps = React.PropsWithChildren<{
  startX: number;
  startY: number;
}>;

export const Pannable = ({
  startX,
  startY,
  children,
}: PannableProps): React.ReactElement => {
  const [pos, setPos] = useState<Vec>([startX, startY]);
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
    setPos((pos) => [pos[0] + e.movementX, pos[1] + e.movementY]);
  };

  const onMouseLeave = (): void => {
    isPanning.current = false;
  };

  return (
    <div
      className={classes.container}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className={classes.pan} style={{ left: pos[0], top: pos[1] }}>
        {children}
      </div>
    </div>
  );
};
