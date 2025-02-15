import React, { useRef, useState } from "react";
import classes from "./Pannable.module.css";

export const Pannable = ({
  children,
}: React.PropsWithChildren): React.ReactElement => {
  const [pos, setPos] = useState<[number, number]>([
    window.innerWidth / 2,
    window.innerHeight / 2,
  ]);
  const isPanning = useRef(false);
  const container = useRef<HTMLDivElement | null>(null);

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.target === container.current && e.button == 0)
      isPanning.current = true;
  };
  const onMouseUp = (e: React.MouseEvent): void => {
    if (e.target === container.current && e.button === 0)
      isPanning.current = false;
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
      ref={container}
    >
      <div className={classes.pan} style={{ left: pos[0], top: pos[1] }}>
        {children}
      </div>
    </div>
  );
};
