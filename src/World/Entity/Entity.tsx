import { useEffect, useState } from "react";
import { EntityType } from "../../types/entity";
import classes from "./Entity.module.css";
import { Channel } from "../channel";
import { Golem } from "../Golem/Golem";
import { UIEntity, UIMessageType } from "../../types/uiMessages";
import { Health } from "../Golem/Health/Health";
import { HeartIcon } from "../../icons";
import { Action } from "../Action/Action";

type EntityProps = {
  id: number;
};

const useEntity = (id: number): UIEntity | undefined => {
  const [entity, setEntity] = useState<UIEntity>();
  useEffect(() => {
    const unsub = Channel.subEntity(id, setEntity);
    Channel.send({
      __type: UIMessageType.REFRESH_ENTITY,
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
  switch (entity.entity.__type) {
    case EntityType.HEART: {
      child = (
        <>
          <svg width="100%" height="100%" viewBox="-32 -32 64 64">
            <Health
              health={entity.entity.health}
              armor={entity.entity.armor}
              shield={entity.entity.shield}
            />
          </svg>
          <HeartIcon style={{ position: "absolute", width: 24, height: 24 }} />
        </>
      );
      break;
    }
    case EntityType.GOLEM: {
      child = (
        <Golem
          runes={entity.entity.runes}
          health={entity.entity.health}
          armor={entity.entity.armor}
          shield={entity.entity.shield}
          mana={entity.entity.mana}
        />
      );

      break;
    }
  }

  return (
    <>
      {entity.action && <Action p={entity.action} />}
      <div
        className={"flex-center absolute " + classes.container}
        style={{
          top: entity.entity.pos[1] * 64,
          left: entity.entity.pos[0] * 64,
        }}
      >
        {child}
      </div>
    </>
  );
};
