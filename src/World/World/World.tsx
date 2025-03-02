import { useEffect, useRef, useState } from "react";
import { Camera, MapData, UIMessageType } from "../../types/uiMessages";
import { Tile } from "../Tile/Tile";
import { Pannable } from "../Pannable/Pannable";
import { useThrottledCallback } from "use-debounce";
import { AddGolem } from "../AddGolem/AddGolem";
import { Channel } from "../channel";
import { ValuesPerTile } from "../../types/map";
import { EntityTile } from "../Entity/Entity";
import { Action } from "../Action/Action";
import { Vec } from "../../types/vec";
import { ACTProgress } from "../../types/ACT";

const emptyMapData = {
  map: {
    width: 0,
    height: 0,
    data: new Int32Array(),
  },
  pos: [0, 0],
  entities: [],
  actions: [],
} satisfies MapData;

export const World = () => {
  const [mapData, setMap] = useState<MapData>(emptyMapData);
  const [pos, setPos] = useState<Vec>([0, 0]);
  const cameraRef = useRef<Camera>({
    pos: [0, 0],
    size: [24, 24],
  });
  const [actP, setACTP] = useState<ACTProgress[]>([]);

  const fetchMap = useThrottledCallback(
    () => {
      Channel.send({
        type: UIMessageType.QUERY,
        data: cameraRef.current,
      });
    },
    100,
    { leading: false }
  );

  const onPan = ([dx, dy]: Vec) => {
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
            entities: [...m.entities, data],
          };
        });
      },
      (data: number) => {
        setMap((m) => {
          return {
            ...m,
            actions: [...m.actions, data],
          };
        });
      },
      (data: number) => {
        setMap((m) => {
          return {
            ...m,
            entities: m.entities.filter((e) => e !== data),
          };
        });
      },
      (data: number) => {
        setMap((m) => {
          return {
            ...m,
            actions: m.actions.filter((a) => a !== data),
          };
        });
      }
    );

    const unsub2 = Channel.subACTProgress(setACTP);

    Channel.send({
      type: UIMessageType.INITIALIZE,
      data: cameraRef.current,
    });

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  if (mapData.map.data.length === 0) return <></>;

  const tiles: JSX.Element[] = [];

  for (let i = 0; i < mapData.map.data.length / ValuesPerTile; i++) {
    tiles.push(
      <Tile
        key={i}
        id={mapData.map.data[i * ValuesPerTile]}
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
        {actP.map((e, i) => (
          <Action key={i} p={e} />
        ))}
        {mapData.entities.map((e) => (
          <EntityTile key={e} id={e} />
        ))}
      </Pannable>
      <AddGolem />
    </>
  );
};
