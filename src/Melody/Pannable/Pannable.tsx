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

  const onMouseDown = ({ button }: React.MouseEvent): boolean =>
    (isPanning.current ||= button === 0);

  const onMouseUp = ({ button }: React.MouseEvent): boolean =>
    (isPanning.current &&= button !== 0);

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
