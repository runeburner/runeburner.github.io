import { ID } from "../../Game/id";
import { Entity } from "../../types/entity";
import { registerRealm } from "../Realms";
import mapData from "./mapData.txt?raw";

const init = (): void => {
  const entities: Entity[] = [
    {
      __type: EntityType.HEART,
      id: ID.next(),
      pos: [5, 5],
      musicalNotes: 0,
      visionRange: 10,
      health: [25, 25],
      armor: [0, 0],
      shield: [0, 0],
    },
  ];

  registerRealm({
    id: "tutorial_0",
    location: [19, 11],
    mapData: mapData,
    startingEntities: entities,
  });
};

init();
