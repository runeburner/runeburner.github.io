import { Game } from "../../Game/game";
import { arrayShallowEquals, useGameSelector } from "../../store/gameRedux";
import { camera } from "../World/Camera";
import { EntityListItem } from "./EntityListItem";

const selectVisibleEntities = (g: Game): number[] => {
  const visible: number[] = [];
  for (const [id, entity] of g.entities.entries()) {
    if (camera.isInView(entity.pos)) {
      visible.push(id);
    }
  }
  return visible;
};

export const EntityList = (): React.ReactElement => {
  const visibleEntities = useGameSelector(
    selectVisibleEntities,
    arrayShallowEquals
  );

  return (
    <div>
      <ul>
        {visibleEntities.map((id) => (
          <EntityListItem key={id} entityID={id} />
        ))}
      </ul>
    </div>
  );
};
