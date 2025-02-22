import { useEffect, useRef, useState } from "react";
import { MessageType } from "../../types/message";
import { Tile } from "../Tile/Tile";
import { Pannable } from "../Pannable/Pannable";
import { useThrottledCallback } from "use-debounce";
import { AddGolem } from "../AddGolem/AddGolem";
import { Entity, EntityType } from "../../types/entity";
import { Golem } from "../Golem/Golem";
import { bc } from "../channel";
import { Map, ValuesPerTile } from "../../types/map";
import { EntityTile } from "../Entity/Entity";
import { Path } from "../Path/Path";
import { Action } from "../../types/actions";

export const World = () => {
  const [map, setMap] = useState<Map>({
    data: new Int32Array(0),
    width: 0,
    height: 0,
  });
  const [[startX, startY], setStartMap] = useState<[number, number]>([0, 0]);
  const [pos, setPos] = useState<[number, number]>([0, 0]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const cameraRef = useRef({
    x: 0,
    y: 0,
    width: 24,
    height: 24,
  });

  const fetchMap = useThrottledCallback(
    () => {
      bc.postMessage({
        type: MessageType.QUERY,
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
    bc.onmessage = ({ data: msg }) => {
      switch (msg.type) {
        case MessageType.MAP: {
          setMap(msg.data.map);
          setStartMap([msg.data.x, msg.data.y]);
          setEntities(msg.data.entities);
          setActions(msg.data.actions);
          if (msg.data.camera) {
            cameraRef.current = msg.data.camera;
            setPos([msg.data.camera.x, msg.data.camera.y]);
          }
          break;
        }
        case MessageType.ADD_ENTITY: {
          setEntities((e) => [...e, msg.data]);
          break;
        }
        case MessageType.ADD_ACTION: {
          setActions((p) => [...p, msg.data]);
          break;
        }
        case MessageType.UPDATE_ENTITY: {
          setEntities((e) =>
            e.map((e) => (e.id === msg.data.id ? msg.data : e))
          );
          break;
        }
        case MessageType.UPDATE_ACTION: {
          setActions((e) =>
            e.map((e) => (e.id === msg.data.id ? msg.data : e))
          );
          break;
        }
      }
    };
    bc.postMessage({
      type: MessageType.INITIALIZE,
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

  const pathComponents: JSX.Element[] = [];
  for (const i in actions) {
    pathComponents.push(<Path key={i} p={actions[i].path} />);
  }

  const entityComponents: JSX.Element[] = [];
  for (const e of entities) {
    switch (e.type) {
      case EntityType.HEART: {
        entityComponents.push(
          <EntityTile key={`${e.x}_${e.y}_${e.type}`} y={e.y} x={e.x}>
            <Golem runes={[]} health={[0, 0]} armor={[0, 0]} shield={[0, 0]} />
          </EntityTile>
        );
        break;
      }
      case EntityType.GOLEM: {
        entityComponents.push(
          <EntityTile key={`${e.x}_${e.y}_${e.type}`} y={e.y} x={e.x}>
            <Golem
              runes={e.runes}
              health={[0, 0]}
              armor={[0, 0]}
              shield={[0, 0]}
            />
          </EntityTile>
        );
        break;
      }
    }
  }

  return (
    <>
      <Pannable pos={pos} onPan={onPan}>
        {tiles}
        {pathComponents}
        {entityComponents}
      </Pannable>
      <AddGolem />
    </>
  );
};
