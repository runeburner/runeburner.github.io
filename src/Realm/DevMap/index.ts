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
    {
      __type: EntityType.DUMMY,
      id: ID.next(),
      pos: [12, 2],
      visionRange: 3,
      health: [15, 15],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.DUMMY,
      id: ID.next(),
      pos: [12, 3],
      visionRange: 3,
      health: [15, 15],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.DUMMY,
      id: ID.next(),
      pos: [12, 4],
      visionRange: 3,
      health: [15, 15],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.DUMMY,
      id: ID.next(),
      pos: [12, 5],
      visionRange: 3,
      health: [15, 15],
      armor: [0, 0],
      shield: [0, 0],
    },
    {
      __type: EntityType.DUMMY,
      id: ID.next(),
      pos: [12, 6],
      visionRange: 3,
      health: [15, 15],
      armor: [0, 0],
      shield: [0, 0],
    },
  ];

  registerRealm({
    id: "dev_map",
    location: [0, 0],
    mapData: mapData,
    startingEntities: entities,
  });
};

init();
