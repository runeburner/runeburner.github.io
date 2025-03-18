import { useEffect, useRef, useState } from "react";
import { EntityType } from "../../types/entity";
import classes from "./Entity.module.css";
import { Golem } from "../Golem/Golem";
import { Health } from "../Golem/Health/Health";
import { HeartIcon } from "../../icons";
import { Action } from "../Action/Action";
import { game } from "../../Game/game";
import { Action as ActionT } from "../../types/actions";
import { UIEntity } from "../../types/uiMessages";
import { uiUpdate, useUIThrottle } from "../uiThrottler";
import { eq } from "../../types/vec";

type EntityProps = {
  id: number;
};

export const entityUpdateMap: Record<string, (e: UIEntity) => void> = {};

export const entityUpdatePosMap: Record<string, (e: Vec) => void> = {};
export const entityUpdateActionMap: Record<string, (e: ActionT) => void> = {};

const useEntityPos = (id: number): Vec => {
  const ref = useRef<Vec>(game.entityM[id].pos);
  const [pos, setPos] = useState<Vec>(game.entityM[id].pos);
  useUIThrottle(() => {
    if (eq(ref.current, pos)) return;
    setPos([...ref.current]);
  });

  useEffect(() => {
    entityUpdatePosMap[id] = (p) => {
      ref.current = p;
      uiUpdate();
    };
    return () => {
      delete entityUpdatePosMap[id];
    };
  }, [id]);
  return pos;
};

const EntityPos = ({
  children,
  id,
}: React.PropsWithChildren<EntityProps>): React.ReactElement => {
  const pos = useEntityPos(id);
  return (
    <div
      className={"flex-center absolute " + classes.container}
      style={{
        top: pos[1] * 64,
        left: pos[0] * 64,
      }}
    >
      {children}
    </div>
  );
};

export const EntityTile = ({ id }: EntityProps): React.ReactElement => {
  const entity = {
    entity: game.entityM[id],
    action: game.actionM[id],
  };
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
      <Action id={id} />
      <EntityPos id={id}>{child}</EntityPos>
    </>
  );
};
