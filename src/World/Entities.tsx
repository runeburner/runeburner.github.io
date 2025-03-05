import { EntityTile } from "./Entity/Entity";
import { useVisibleEntities } from "./World/Camera";

export const Entities = (): React.ReactElement => {
  const entities = useVisibleEntities();
  return (
    <>
      {entities.map((e) => (
        <EntityTile key={e.id} id={e.id} />
      ))}
    </>
  );
};
