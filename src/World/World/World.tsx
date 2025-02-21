import { useEffect, useRef, useState } from "react";
import { MessageTypes, UIMessage } from "../../Game/messages";
import { Tile } from "../Tile/Tile";
import { Pannable } from "../Pannable/Pannable";
import { useThrottledCallback } from "use-debounce";
import { AddGolem } from "../AddGolem/AddGolem";

type UIChannel = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null;
  postMessage: (message: UIMessage) => void;
};

const bc: UIChannel = new BroadcastChannel("UI");

export const World = () => {
  const [map, setMap] = useState<number[][]>([]);
  const [[startX, startY], setStartMap] = useState<[number, number]>([0, 0]);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const cameraRef = useRef({
    x: 0,
    y: 0,
    width: 5,
    height: 5,
  });

  const fetchMap = useThrottledCallback(
    () => {
      bc.postMessage({
        type: MessageTypes.SUBSCRIBE,
        data: cameraRef.current,
      });
    },
    100,
    { leading: false }
  );

  const onPan = ([dx, dy]: [number, number]) => {
    const nextPos: [number, number] = [pos[0] + dx, pos[1] + dy];
    setPos(nextPos);
    cameraRef.current.x = -Math.floor(nextPos[0] / 64);
    cameraRef.current.y = -Math.floor(nextPos[1] / 64);
    fetchMap();
  };

  useEffect(() => {
    bc.onmessage = (event) => {
      const msg = event.data as UIMessage;
      if (msg.type === "MAP") {
        setMap(event.data.data.tiles);
        setStartMap([event.data.data.x, event.data.data.y]);
      }
    };
    bc.postMessage({
      type: MessageTypes.SUBSCRIBE,
      data: cameraRef.current,
    });

    return () => {
      bc.onmessage = null;
    };
  }, []);

  if (map.length === 0) return <></>;

  return (
    <>
      <Pannable pos={pos} onPan={onPan}>
        {map.map((row, i) =>
          row.map((t, j) => (
            <Tile key={`${i}_${j}`} id={t} x={startX + i} y={startY + j} />
          ))
        )}
      </Pannable>
      <AddGolem />
    </>
  );
};
