import { useEffect, useRef, useState } from "react";
import { MessageTypes, UIMessage } from "../../Game/messages";
import { Tile } from "../Tile/Tile";
import { Pannable } from "../Pannable/Pannable";
import { useThrottledCallback } from "use-debounce";
import { AddGolem } from "../AddGolem/AddGolem";
import { Map, ValuesPerTile } from "../../Game/worker";

type UIChannel = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null;
  postMessage: (message: UIMessage) => void;
};

const bc: UIChannel = new BroadcastChannel("UI");

export const World = () => {
  const [map, setMap] = useState<Map>({
    data: new Int32Array(0),
    width: 0,
    height: 0,
  });
  const [[startX, startY], setStartMap] = useState<[number, number]>([0, 0]);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const cameraRef = useRef({
    x: 0,
    y: 0,
    width: 12,
    height: 12,
  });

  const fetchMap = useThrottledCallback(
    () => {
      bc.postMessage({
        type: MessageTypes.SUBSCRIBE,
        data: cameraRef.current,
      });
    },
    500,
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
        setMap(event.data.data.map);
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

  if (map.data.length === 0) return <></>;

  const tiles: JSX.Element[] = [];

  for (let i = 0; i < map.data.length / ValuesPerTile; i++) {
    tiles.push(
      <Tile
        key={i}
        id={map.data[i * ValuesPerTile]}
        x={startX + (i % map.width)}
        y={startY + Math.floor(i / map.width)}
      />
    );
  }
  return (
    <>
      <Pannable pos={pos} onPan={onPan}>
        {tiles}
      </Pannable>
      <AddGolem />
    </>
  );
};
