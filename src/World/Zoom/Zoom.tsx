import { RefObject, useCallback, useEffect } from "react";
import { MinusIcon, PlusIcon } from "../../icons";
import { camera } from "../World/Camera";
import classes from "./Zoom.module.css";

type ZoomProps = {
  canvas: RefObject<HTMLCanvasElement>;
};

export const Zoom = ({ canvas }: ZoomProps): React.ReactElement => {
  const onZoom = useCallback(
    (iin: boolean): void => {
      const ctx = canvas.current?.getContext("2d");
      if (!ctx || !canvas.current) return;
      camera.zoom(iin, [canvas.current.width / 2, canvas.current.height / 2]);
      camera.fitToContext(ctx);
    },
    [canvas]
  );

  useEffect(() => {
    const handler = (ev: KeyboardEvent): void => {
      if (ev.key === "w") {
        onZoom(true);
      } else if (ev.key === "s") {
        onZoom(false);
      }
    };
    document.addEventListener("keypress", handler);
    return (): void => {
      document.removeEventListener("keypress", handler);
    };
  }, [onZoom]);

  return (
    <div className={"m-4 p-2 fixed flex flex-col " + classes.container}>
      <button className={"btn mb-2"}>
        <PlusIcon onClick={() => onZoom(true)} />
      </button>
      <button className={"btn"}>
        <MinusIcon onClick={() => onZoom(false)} />
      </button>
    </div>
  );
};
