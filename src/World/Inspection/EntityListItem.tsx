import { useCallback, useState } from "react";
import { useGameSelector } from "../../store/gameRedux";
import { Game } from "../../Game/game";
import { EntityType } from "../../types/entity";
import { useTranslation } from "react-i18next";
import { GolemDetails } from "./GolemDetails";

type EntityListItemProps = {
  entityID: number;
};

export const EntityListItem = ({
  entityID,
}: EntityListItemProps): React.ReactElement => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const __type = useGameSelector(
    useCallback(
      (g: Game): EntityType | undefined => g.entities.get(entityID)?.__type,
      [entityID]
    )
  );
  return (
    <>
      <li onClick={() => setExpanded((b) => !b)}>
        <b>
          {t(`entity.${__type}`)} ({entityID})
        </b>
      </li>
      {expanded && (
        <li>
          {__type === EntityType.GOLEM && <GolemDetails entityID={entityID} />}
        </li>
      )}
    </>
  );
};
