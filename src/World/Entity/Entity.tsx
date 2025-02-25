import { useEffect, useState } from "react";
import { Entity, EntityType } from "../../types/entity";
import classes from "./Entity.module.css";
import { Channel } from "../channel";
import { Golem } from "../Golem/Golem";
import { MessageType } from "../../types/message";
import { Health } from "../Golem/Health/Health";
import { HeartIcon } from "../../icons";

type EntityProps = {
  id: string;
};

const useEntity = (id: string): Entity | undefined => {
  const [entity, setEntity] = useState<Entity>();
  useEffect(() => {
    const unsub = Channel.subEntity(id, setEntity);
    Channel.send({
      type: MessageType.REFRESH_ENTITY,
      data: id,
    });
    return unsub;
  }, [id]);
  return entity;
};

export const EntityTile = ({ id }: EntityProps): React.ReactElement => {
  const entity = useEntity(id);
  if (!entity) return <></>;
  let child = <></>;
  switch (entity.type) {
    case EntityType.HEART: {
      child = (
        <>
          <svg width="100%" height="100%" viewBox="-32 -32 64 64">
            <Health health={[50, 50]} armor={[0, 0]} shield={[0, 0]} />
          </svg>
          <HeartIcon style={{ position: "absolute", width: 24, height: 24 }} />
        </>
      );
      break;
    }
    case EntityType.GOLEM: {
      child = (
        <Golem
          runes={entity.runes}
          health={[0, 0]}
          armor={[0, 0]}
          shield={[0, 0]}
        />
      );

      break;
    }
  }

  return (
    <div
      className={classes.container}
      style={{
        top: entity.pos[1] * 64,
        left: entity.pos[0] * 64,
      }}
    >
      {child}
    </div>
  );
};
