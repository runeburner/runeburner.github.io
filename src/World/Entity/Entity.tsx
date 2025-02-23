import { useEffect, useState } from "react";
import { Entity, EntityType } from "../../types/entity";
import classes from "./Entity.module.css";
import { Channel } from "../channel";
import { Golem } from "../Golem/Golem";
import { MessageType } from "../../types/message";

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
        <Golem runes={[]} health={[0, 0]} armor={[0, 0]} shield={[0, 0]} />
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
        top: entity.y * 64,
        left: entity.x * 64,
      }}
    >
      {child}
    </div>
  );
};
