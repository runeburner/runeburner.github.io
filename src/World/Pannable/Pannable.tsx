import React, { useRef } from "react";
import classes from "./Pannable.module.css";

type PannableProps = React.PropsWithChildren<{
  pos: [number, number];
  onPan: (diff: [number, number]) => void;
}>;

export const Pannable = ({
  children,
  pos,
  onPan,
}: PannableProps): React.ReactElement => {
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
    onPan([e.movementX, e.movementY]);
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
