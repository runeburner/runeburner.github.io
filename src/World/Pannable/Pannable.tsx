import React, { useRef } from "react";
import classes from "./Pannable.module.css";
import { Vec } from "../../types/vec";

type PannableProps = React.PropsWithChildren<{
  pos: Vec;
  onPan: (diff: Vec) => void;
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
