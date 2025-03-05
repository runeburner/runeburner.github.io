import { useEffect, useRef, useState } from "react";
import { Camera, MapData, UIMessageType } from "../../types/uiMessages";
import { Tile } from "../Tile/Tile";
import { Pannable } from "../Pannable/Pannable";
import { useThrottledCallback } from "use-debounce";
import { AddGolem } from "../AddGolem/AddGolem";
import { Channel } from "../channel";
import { ValuesPerTile } from "../../types/map";
import { EntityTile } from "../Entity/Entity";
import { Vec } from "../../types/vec";

const emptyMapData = {
  map: {
    width: 0,
    height: 0,
    data: new Int32Array(),
  },
  pos: [0, 0],
  entityIDs: [],
} satisfies MapData;

export const World = (): React.ReactElement => {
  const [mapData, setMap] = useState<MapData>(emptyMapData);
  const [pos, setPos] = useState<Vec>([0, 0]);
  const cameraRef = useRef<Camera>({
    pos: [0, 0],
    size: [24, 24],
  });

  const fetchMap = useThrottledCallback(
    () => {
      Channel.send({
        __type: UIMessageType.QUERY,
        data: cameraRef.current,
      });
    },
    100,
    { leading: false }
  );

  const onPan = ([dx, dy]: Vec): void => {
    const nextPos: Vec = [pos[0] + dx, pos[1] + dy];
    setPos(nextPos);
    cameraRef.current.pos[0] = -Math.floor(nextPos[0] / 64);
    cameraRef.current.pos[1] = -Math.floor(nextPos[1] / 64);

    fetchMap();
  };

  useEffect(() => {
    const unsub = Channel.subMap(
      (data: MapData) => {
        setMap(data);
        if (data.camera) {
          cameraRef.current = data.camera;
          setPos([...data.camera.pos]);
        }
      },
      (data: number) => {
        setMap((m) => {
          return {
            ...m,
            entityIDs: [...m.entityIDs, data],
          };
        });
      },
      (data: number) => {
        setMap((m) => {
          return {
            ...m,
            entityIDs: m.entityIDs.filter((e) => e !== data),
          };
        });
      }
    );

    Channel.send({
      __type: UIMessageType.INITIALIZE,
      data: cameraRef.current,
    });

    return unsub;
  }, []);

  if (mapData.map.data.length === 0) return <></>;

  const tiles: JSX.Element[] = [];

  for (let i = 0; i < mapData.map.data.length / ValuesPerTile; i++) {
    tiles.push(
      <Tile
        key={i}
        data={mapData.map.data.slice(
          i * ValuesPerTile,
          (i + 1) * ValuesPerTile
        )}
        pos={[
          mapData.pos[0] + (i % mapData.map.width),
          mapData.pos[1] + Math.floor(i / mapData.map.width),
        ]}
      />
    );
  }

  return (
    <>
      <Pannable pos={pos} onPan={onPan}>
        {tiles}
        {mapData.entityIDs.map((e) => (
          <EntityTile key={e} id={e} />
        ))}
      </Pannable>
      <AddGolem />
    </>
  );
};
