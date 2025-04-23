import { useCallback } from "react";
import { useGameSelector } from "../../store/gameRedux";
import { ActionType } from "../../types/actions";
import { Game } from "../../Game/game";

type GolemDetailsProps = {
  entityID: number;
};

export const GolemDetails = ({
  entityID,
}: GolemDetailsProps): React.ReactElement => {
  const action = useGameSelector(
    useCallback(
      (g: Game): ActionType | undefined => g.actions.get(entityID)?.__type,
      [entityID]
    )
  );
  const health = useGameSelector(
    useCallback(
      (g: Game): number[] => {
        const golem = g.entities.get(entityID);
        if (golem?.__type !== EntityType.GOLEM) return [];
        const total = golem.health[1] + golem.armor[1] + golem.shield[1];
        return [golem.health[0], golem.armor[0], golem.shield[0], total];
      },
      [entityID]
    )
  );

  return (
    <>
      <p>{action}</p>
      <p>
        Health: {health[0]}+{health[1]}+{health[2]} / {health[3]}
      </p>
    </>
  );
};
